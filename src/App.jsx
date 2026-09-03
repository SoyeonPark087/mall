import { useEffect, useState } from 'react'

const FRUIT_URL =
  'https://soyeonpark087.github.io/mall/images/json/fruit.json'

const VEGGIE_URL =
  'https://soyeonpark087.github.io/mall/images/json/veggie.json'

const SHOP_BASE =
  'https://soyeonpark087.github.io/mall/'

function ProductCard({ item }) {
  const cleanPath = String(item.imgurl || '').replace(/^\/+/, '')
  const imageUrl = `${SHOP_BASE}${cleanPath}`

  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <img
          className="product-image"
          src={imageUrl}
          alt={item.title}
          loading="lazy"
        />
      </div>

      <div className="product-info">
        <h3 className="product-title">{item.title}</h3>
        <p className="product-content">{item.content}</p>
        <p className="product-price">
          {Number(item.price).toLocaleString('ko-KR')}원
        </p>
      </div>
    </article>
  )
}

function ProductSection({ title, items }) {
  const [expanded, setExpanded] = useState(false)

  const visibleItems = expanded ? items : items.slice(0, 4)

  return (
    <section className="product-section">
      <h2 className="section-title">{title}</h2>

      <div className="product-grid">
        {visibleItems.map((item) => (
          <ProductCard key={item.id} item={item} />
        ))}
      </div>

      {items.length > 4 && (
        <div className="more-wrap">
          <button
            type="button"
            className="more-button"
            onClick={() => setExpanded((prev) => !prev)}
            aria-expanded={expanded}
          >
            {expanded ? '접기' : '더보기'}
            <span
              className={`more-arrow ${expanded ? 'is-open' : ''}`}
              aria-hidden="true"
            />
          </button>
        </div>
      )}
    </section>
  )
}

function App() {
  const [fruit, setFruit] = useState([])
  const [veggie, setVeggie] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    async function loadProducts() {
      try {
        setLoading(true)
        setError(false)

        const [fruitResponse, veggieResponse] = await Promise.all([
          fetch(FRUIT_URL, { signal: controller.signal }),
          fetch(VEGGIE_URL, { signal: controller.signal }),
        ])

        if (!fruitResponse.ok || !veggieResponse.ok) {
          throw new Error('상품 데이터를 불러오지 못했습니다.')
        }

        const [fruitData, veggieData] = await Promise.all([
          fruitResponse.json(),
          veggieResponse.json(),
        ])

        setFruit(Array.isArray(fruitData) ? fruitData : [])
        setVeggie(Array.isArray(veggieData) ? veggieData : [])
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error(err)
          setError(true)
        }
      } finally {
        setLoading(false)
      }
    }

    loadProducts()

    return () => controller.abort()
  }, [])

  return (
    <main className="page">
      <div className="inner">
        {loading && (
          <p className="state-message">상품을 불러오는 중입니다.</p>
        )}

        {error && (
          <p className="state-message state-message--error">
            상품 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
          </p>
        )}

        {!loading && !error && (
          <>
            <ProductSection
              title="ONLY 총각네 과일 할인 특가"
              items={fruit}
            />

            <ProductSection
              title="ONLY 총각네 야채 할인 특가"
              items={veggie}
            />
          </>
        )}
      </div>
    </main>
  )
}

export default App
