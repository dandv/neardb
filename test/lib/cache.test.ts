import Cache from '../../src/lib/cache'
import { uuid } from '../../src/lib/utils'
import { config } from '../config'
import { createDummyData, createDoc, timeout } from '../helpers'

jest.setTimeout(10000)

describe('.cache', async () => {
  let cachedData = createDummyData()
  let doc = createDoc(uuid(), {})
  let etag = 'asdfaf2331fsd'
  let versionId = 'asdfaf2331fsd'

  it('.setCache', async () => {
    expect.assertions(2)
    doc.cache.set(cachedData, etag, versionId)
    expect(doc.cache.expires).toBeGreaterThan(new Date().getTime())
    expect(doc.cache.get()).toEqual(cachedData)
  })

  it('.getCache', async () => {
    expect.assertions(1)
    doc.cache.set(cachedData, etag)
    expect(doc.cache.get()).toEqual(cachedData)
  })

  it('.getEtag', async () => {
    expect.assertions(1)
    doc.cache.set(cachedData, etag)
    expect(doc.cache.getEtag()).toEqual(etag)
  })

  it('.setCache without ETag', async () => {
    expect.assertions(2)
    doc.cache.set(cachedData)
    expect(doc.cache.expires).toBeGreaterThan(new Date().getTime())
    expect(doc.cache.get()).toEqual(cachedData)
  })

  it('Cache Exists', async () => {
    let expiration = config.cacheExpiration ? config.cacheExpiration : 0
    expect.assertions(2)
    await doc.cache.set(cachedData)
    expect(doc.cache.exists()).toEqual(true)
    await timeout(expiration + 1)
    expect(doc.cache.exists()).toEqual(false)
  })
})
