import { useEffect, useMemo, useRef, useState } from 'react'
import celebrationCake from './assets/CelebrationCake.png'
import logo from './assets/logo.png'
import themeCake from './assets/ThemeCake.png'
import weddingCake from './assets/WeddingCake.png'
import './App.css'

const frameModules = import.meta.glob('./scroll/ezgif-frame-*.jpg', {
  eager: true,
  import: 'default',
})

const galleryModules = import.meta.glob('./gallery/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
})

const scrollFrames = Object.entries(frameModules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, frame]) => frame)

const titleMap = {
  CrimsonNoirElegance: 'Crimson Noir Elegance',
  Finishedweddingcentrepiece: 'Finished wedding centrepiece',
  Foundationdetail: 'Foundation detail',
  Goldbotanicalfinish: 'Gold botanical finish',
  Grandroomreveal: 'Grand room reveal',
  MidnightRoseRoyale: 'Midnight Rose Royale',
  Sculptedmovement: 'Sculpted movement',
  Tierconstruction: 'Tier construction',
  VelvetEmberWeddingCake: 'Velvet Ember Wedding Cake',
}

const galleryOrder = [
  'Finishedweddingcentrepiece',
  'Foundationdetail',
  'Goldbotanicalfinish',
  'Grandroomreveal',
  'Sculptedmovement',
  'Tierconstruction',
  'MidnightRoseRoyale',
  'CrimsonNoirElegance',
  'VelvetEmberWeddingCake',
]

const getGalleryTitle = (path) => {
  const fileName = path.split('/').pop().replace(/\.[^.]+$/, '')

  return titleMap[fileName] || fileName.replace(/([a-z])([A-Z])/g, '$1 $2')
}

const gallery = Object.entries(galleryModules)
  .sort(([a], [b]) => {
    const fileA = a.split('/').pop().replace(/\.[^.]+$/, '')
    const fileB = b.split('/').pop().replace(/\.[^.]+$/, '')
    const indexA = galleryOrder.indexOf(fileA)
    const indexB = galleryOrder.indexOf(fileB)

    if (indexA !== -1 || indexB !== -1) {
      return (indexA === -1 ? Number.MAX_SAFE_INTEGER : indexA) - (indexB === -1 ? Number.MAX_SAFE_INTEGER : indexB)
    }

    return a.localeCompare(b)
  })
  .map(([path, image]) => ({
    image,
    title: getGalleryTitle(path),
  }))

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Cakes', href: '#signature' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Ordering', href: '#ordering' },
  { label: 'Contact', href: '#contact' },
]

const signatureCakes = [
  {
    title: 'Wedding Cakes',
    image: weddingCake,
    text: 'Refined tiered centrepieces with sculpted detail, floral accents, and a graceful finish for grand celebrations.',
  },
  {
    title: 'Celebration Cakes',
    image: celebrationCake,
    text: 'Elegant birthday, anniversary, and milestone cakes designed around the story of each occasion.',
  },
  {
    title: 'Theme Cakes',
    image: themeCake,
    text: 'Premium custom concepts shaped with balance, precision, and a polished visual language.',
  },
]

const advantages = [
  'Custom designed cakes',
  'Premium ingredients',
  'Personalized service',
  'Freshly made for every order',
  'Appointment-based production',
  'Exclusive creations',
]

const processSteps = [
  'Contact KingLakeCakes',
  'Discuss cake requirements',
  'Confirm appointment',
  'Approve the design direction',
  'Cake preparation begins',
  'Delivery or pickup is arranged',
]

const testimonials = [
  {
    quote: 'A centrepiece that felt personal, elegant, and perfectly made for the celebration.',
    name: 'Wedding celebration',
  },
  {
    quote: 'The design process was thoughtful from the first enquiry to the final reveal.',
    name: 'Custom theme order',
  },
  {
    quote: 'Premium ingredients, beautiful detailing, and a finish that looked exceptional in every photo.',
    name: 'Birthday event',
  },
]

const iconPaths = {
  calendar:
    'M8 2v3M16 2v3M3.5 9.5h17M5.5 4h13A2.5 2.5 0 0 1 21 6.5v12A2.5 2.5 0 0 1 18.5 21h-13A2.5 2.5 0 0 1 3 18.5v-12A2.5 2.5 0 0 1 5.5 4Z',
  message:
    'M4.5 5.5A3.5 3.5 0 0 1 8 2h8a3.5 3.5 0 0 1 3.5 3.5v6A3.5 3.5 0 0 1 16 15H9l-4.5 5v-14.5Z',
  phone:
    'M6.5 3.5 9.5 3l1.5 4-2 1.4a13 13 0 0 0 5.6 5.6l1.4-2 4 1.5-.5 3a2 2 0 0 1-2 1.7A15.5 15.5 0 0 1 4.8 5.5a2 2 0 0 1 1.7-2Z',
  mail:
    'M4 6h16v12H4V6Zm0 1 8 6 8-6',
  sparkle:
    'M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2ZM6 15l.8 2.2L9 18l-2.2.8L6 21l-.8-2.2L3 18l2.2-.8L6 15Z',
  social:
    'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm5 6.2A3.8 3.8 0 1 0 12 15.8 3.8 3.8 0 0 0 12 8.2Zm5.2-1.4h.1',
}

function Icon({ name }) {
  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d={iconPaths[name]} />
    </svg>
  )
}

function App() {
  const heroRef = useRef(null)
  const canvasRef = useRef(null)
  const frameImagesRef = useRef([])
  const loadedFramesRef = useRef(new Set())
  const targetFrameRef = useRef(0)
  const smoothedFrameRef = useRef(0)
  const renderedFrameRef = useRef(-1)
  const viewportRef = useRef({ width: 0, height: 0, dpr: 1 })
  const [sequence, setSequence] = useState({ index: 0, progress: 0 })
  const [activeImage, setActiveImage] = useState(null)
  const [enquirySent, setEnquirySent] = useState(false)

  const isFinalFrame = sequence.index === scrollFrames.length - 1

  useEffect(() => {
    let isCancelled = false
    const loadedFrames = loadedFramesRef.current

    const getDrawableFrame = (index) => {
      if (loadedFrames.has(index)) {
        return index
      }

      for (let offset = 1; offset < scrollFrames.length; offset += 1) {
        const lower = index - offset
        const upper = index + offset

        if (lower >= 0 && loadedFrames.has(lower)) {
          return lower
        }

        if (upper < scrollFrames.length && loadedFrames.has(upper)) {
          return upper
        }
      }

      return -1
    }

    const drawFrame = (requestedIndex, force = false) => {
      const canvas = canvasRef.current
      const drawableIndex = getDrawableFrame(requestedIndex)

      if (!canvas || drawableIndex < 0 || (!force && renderedFrameRef.current === drawableIndex)) {
        return
      }

      const image = frameImagesRef.current[drawableIndex]
      const { width, height, dpr } = viewportRef.current

      if (!image || !width || !height || !image.naturalWidth || !image.naturalHeight) {
        return
      }

      const context = canvas.getContext('2d')

      if (!context) {
        return
      }

      const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight)
      const drawWidth = image.naturalWidth * scale
      const drawHeight = image.naturalHeight * scale
      const x = (width - drawWidth) / 2
      const y = (height - drawHeight) / 2

      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      context.clearRect(0, 0, width, height)
      context.drawImage(image, x, y, drawWidth, drawHeight)
      renderedFrameRef.current = drawableIndex
    }

    const resizeCanvas = () => {
      const canvas = canvasRef.current

      if (!canvas) {
        return
      }

      const bounds = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const width = Math.max(1, Math.round(bounds.width))
      const height = Math.max(1, Math.round(bounds.height))

      viewportRef.current = { width, height, dpr }
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      drawFrame(Math.round(smoothedFrameRef.current), true)
    }

    frameImagesRef.current = scrollFrames.map((frame, index) => {
      const image = new Image()
      image.decoding = 'async'
      image.loading = 'eager'

      if (index === 0 || index === scrollFrames.length - 1) {
        image.fetchPriority = 'high'
      }

      image.onload = () => {
        if (isCancelled) {
          return
        }

        loadedFrames.add(index)
        drawFrame(Math.round(smoothedFrameRef.current), index === 0)
      }

      image.src = frame

      return image
    })

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    let animationFrame = 0

    const animateFrames = () => {
      const targetFrame = targetFrameRef.current
      const currentFrame = smoothedFrameRef.current
      const distance = targetFrame - currentFrame

      if (Math.abs(distance) < 0.04) {
        smoothedFrameRef.current = targetFrame
      } else {
        smoothedFrameRef.current = currentFrame + distance * 0.18
      }

      drawFrame(Math.round(smoothedFrameRef.current))
      animationFrame = requestAnimationFrame(animateFrames)
    }

    animationFrame = requestAnimationFrame(animateFrames)

    return () => {
      isCancelled = true
      cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', resizeCanvas)
      frameImagesRef.current = []
      loadedFrames.clear()
    }
  }, [])

  useEffect(() => {
    let animationFrame = 0

    const updateSequence = () => {
      const hero = heroRef.current

      if (!hero) {
        return
      }

      const scrollDistance = hero.offsetHeight - window.innerHeight
      const traveled = Math.min(Math.max(window.scrollY - hero.offsetTop, 0), scrollDistance)
      const progress = scrollDistance > 0 ? traveled / scrollDistance : 0
      const frameProgress = Math.min(progress / 0.9, 1)
      const index = Math.min(
        scrollFrames.length - 1,
        Math.round(frameProgress * (scrollFrames.length - 1)),
      )

      targetFrameRef.current = index

      setSequence((previous) => {
        if (previous.index === index && Math.abs(previous.progress - progress) < 0.008) {
          return previous
        }

        return { index, progress }
      })
    }

    const onScroll = () => {
      cancelAnimationFrame(animationFrame)
      animationFrame = requestAnimationFrame(updateSequence)
    }

    updateSequence()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      cancelAnimationFrame(animationFrame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  useEffect(() => {
    if (!activeImage) {
      return undefined
    }

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setActiveImage(null)
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => window.removeEventListener('keydown', onKeyDown)
  }, [activeImage])

  useEffect(() => {
    const revealItems = document.querySelectorAll('.reveal-on-scroll')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
          }
        })
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 },
    )

    revealItems.forEach((item) => observer.observe(item))

    return () => observer.disconnect()
  }, [])

  const introState = useMemo(
    () => ({
      opacity: Math.max(0, Math.min(1, (sequence.progress - 0.9) / 0.06)),
      scale: 0.98 + Math.max(0, Math.min(1, sequence.progress)) * 0.045,
    }),
    [sequence.progress],
  )

  const handleEnquirySubmit = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const body = [
      `Name: ${formData.get('name')}`,
      `Event Date: ${formData.get('date')}`,
      `Order Type: ${formData.get('orderType')}`,
      `Message: ${formData.get('message') || 'No message provided'}`,
    ].join('\n')

    setEnquirySent(true)
    window.location.href = `mailto:hello@kinglakecakes.com?subject=${encodeURIComponent(
      'KingLakeCakes Appointment Enquiry',
    )}&body=${encodeURIComponent(body)}`
  }

  return (
    <div className="site-shell" id="website">
      <header className={`site-header ${isFinalFrame ? 'is-launched' : ''}`}>
        <a className="brand" href="#website" aria-label="KingLakeCakes home">
          <img className="brand-logo" src={logo} alt="KingLakeCakes" />
        </a>
        <nav className="primary-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <a href={item.href} key={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <a className="header-action" href="#contact">
          <Icon name="calendar" />
          <span>Appointment</span>
        </a>
      </header>

      <main>
        <section className="hero-section" ref={heroRef} aria-labelledby="hero-title">
          <div className="hero-pin">
            <canvas
              className="hero-canvas"
              ref={canvasRef}
              aria-hidden="true"
              style={{ transform: `scale(${introState.scale})` }}
            />
            <div className="hero-scrim" />
            <div
              className="section-inner hero-content"
              style={{
                opacity: introState.opacity,
                transform: `translateY(${28 - introState.opacity * 28}px)`,
              }}
            >
              <p className="eyebrow">Premium custom cake studio</p>
              <h1 id="hero-title">KingLakeCakes</h1>
              <p>Bespoke celebration cakes crafted exclusively by appointment.</p>
              <div className="hero-actions">
                <a className="button button-primary" href="#contact">
                  <Icon name="calendar" />
                  <span>Book an Appointment</span>
                </a>
                <a className="button button-secondary" href="#signature">
                  <Icon name="sparkle" />
                  <span>View Cakes</span>
                </a>
              </div>
            </div>
            <div className="sequence-meter" aria-hidden="true">
              <span style={{ transform: `scaleX(${sequence.progress})` }} />
            </div>
          </div>
        </section>

        <section className="about-section page-band reveal-on-scroll" id="about" aria-labelledby="about-title">
          <div className="section-inner about-grid">
            <div>
              <p className="eyebrow">About the studio</p>
              <h2 id="about-title">Cake craftsmanship with a luxury showcase sensibility.</h2>
            </div>
            <div className="about-copy">
              <p>
                KingLakeCakes creates custom cakes for clients who want a celebration piece that
                feels considered, polished, and personal. Every cake begins with a conversation,
                then moves through flavour, scale, finish, and design details before production.
              </p>
              <p>
                The studio focuses on premium ingredients, elegant presentation, and made-to-order
                preparation so every cake is fresh, exclusive, and shaped around the occasion.
              </p>
            </div>
            <div className="studio-notes" aria-label="Studio highlights">
              <span>Custom expertise</span>
              <span>Quality ingredients</span>
              <span>Advance confirmation</span>
            </div>
          </div>
        </section>

        <section
          className="showcase-section page-band dark-band reveal-on-scroll"
          id="signature"
          aria-labelledby="signature-title"
        >
          <div className="section-inner">
            <div className="section-heading">
              <p className="eyebrow">Signature cakes</p>
              <h2 id="signature-title">A curated showcase for unforgettable occasions.</h2>
            </div>
            <div className="cake-grid">
              {signatureCakes.map((cake) => (
                <article className="cake-card" key={cake.title}>
                  <img
                    src={cake.image}
                    alt={`${cake.title} by KingLakeCakes`}
                    loading="lazy"
                    decoding="async"
                  />
                  <div>
                    <h3>{cake.title}</h3>
                    <p>{cake.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="why-section page-band reveal-on-scroll" aria-labelledby="why-title">
          <div className="section-inner split-section">
            <div>
              <p className="eyebrow">Why choose KingLakeCakes</p>
              <h2 id="why-title">Built for clients who value design, freshness, and personal service.</h2>
            </div>
            <div className="advantage-grid">
              {advantages.map((advantage) => (
                <div className="advantage-item" key={advantage}>
                  <Icon name="sparkle" />
                  <span>{advantage}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="gallery-section page-band soft-band reveal-on-scroll" id="gallery" aria-labelledby="gallery-title">
          <div className="section-inner">
            <div className="section-heading narrow-heading">
              <p className="eyebrow">Cake gallery</p>
              <h2 id="gallery-title">Finished details, graceful forms, and celebration-ready presentation.</h2>
            </div>
            <div className="masonry-gallery">
              {gallery.map((item) => (
                <button
                  className="gallery-item"
                  type="button"
                  key={item.title}
                  onClick={() => setActiveImage(item)}
                >
                  <img src={item.image} alt={item.title} loading="lazy" decoding="async" />
                  <span>{item.title}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="ordering-section page-band reveal-on-scroll" id="ordering" aria-labelledby="ordering-title">
          <div className="section-inner ordering-grid">
            <div>
              <p className="eyebrow">Appointment-based ordering</p>
              <h2 id="ordering-title">A clear process for custom cake enquiries.</h2>
              <p>
                All cakes are crafted exclusively on appointment and advance confirmation. Walk-in
                purchases are not available.
              </p>
            </div>
            <ol className="process-list">
              {processSteps.map((step, index) => (
                <li key={step}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <p>{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="testimonial-section page-band dark-band reveal-on-scroll" aria-labelledby="testimonial-title">
          <div className="section-inner">
            <div className="section-heading">
              <p className="eyebrow">Celebration stories</p>
              <h2 id="testimonial-title">Designed for moments people remember.</h2>
            </div>
            <div className="testimonial-grid">
              {testimonials.map((testimonial) => (
                <figure className="testimonial-card" key={testimonial.name}>
                  <blockquote>{testimonial.quote}</blockquote>
                  <figcaption>{testimonial.name}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="contact-section page-band reveal-on-scroll" id="contact" aria-labelledby="contact-title">
          <div className="section-inner contact-grid">
            <div>
              <p className="eyebrow">Contact and enquiry</p>
              <h2 id="contact-title">Book a private cake appointment.</h2>
              <p>
                Share the event date, guest count, flavour preferences, and visual direction. The
                studio will confirm availability before the design is approved.
              </p>
              <div className="contact-actions" aria-label="Quick contact links">
                <a className="button button-primary" href="tel:+910000000000">
                  <Icon name="phone" />
                  <span>Call Now</span>
                </a>
                <a className="button button-secondary" href="https://wa.me/910000000000">
                  <Icon name="message" />
                  <span>WhatsApp Now</span>
                </a>
              </div>
            </div>
            <form className="enquiry-form" onSubmit={handleEnquirySubmit}>
              <label>
                <span>Name</span>
                <input type="text" name="name" autoComplete="name" required />
              </label>
              <label>
                <span>Event Date</span>
                <input type="date" name="date" required />
              </label>
              <label>
                <span>Order Type</span>
                <select name="orderType" defaultValue="Wedding cake">
                  <option>Wedding cake</option>
                  <option>Birthday cake</option>
                  <option>Theme cake</option>
                  <option>Premium custom cake</option>
                </select>
              </label>
              <label>
                <span>Message</span>
                <textarea name="message" rows="4" placeholder="Tell us about the occasion" />
              </label>
              <button className="button button-primary form-button" type="submit">
                <Icon name="mail" />
                <span>{enquirySent ? 'Enquiry Noted' : 'Send Enquiry'}</span>
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer className="site-footer reveal-on-scroll">
          <div className="section-inner footer-grid">
            <a className="brand" href="#website" aria-label="KingLakeCakes home">
            <img className="brand-logo footer-logo" src={logo} alt="KingLakeCakes" />
          </a>
          <div className="footer-contact">
            <a href="mailto:hello@kinglakecakes.com">
              <Icon name="mail" />
              <span>hello@kinglakecakes.com</span>
            </a>
            <a href="https://www.instagram.com/kinglakecakes" aria-label="KingLakeCakes Instagram">
              <Icon name="social" />
              <span>@kinglakecakes</span>
            </a>
          </div>
          <p>Copyright 2026 KingLakeCakes. Premium custom cakes by appointment.</p>
        </div>
      </footer>

      {activeImage && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={activeImage.title}>
          <button className="lightbox-backdrop" type="button" onClick={() => setActiveImage(null)} />
          <div className="lightbox-panel">
            <button className="lightbox-close" type="button" onClick={() => setActiveImage(null)} aria-label="Close preview">
              x
            </button>
            <img src={activeImage.image} alt={activeImage.title} decoding="async" />
            <p>{activeImage.title}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
