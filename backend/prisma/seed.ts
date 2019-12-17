import { Photon } from '@prisma/photon'
const photon = new Photon()

async function main() {
  const memeBonus = await photon.trumpAttributes.create({
    data: {
      name: 'Meme Bonus',
    }
  })

  const impeachmentPack = await photon.trumpPacks.create({
    data: {
      name: 'Impeachment Deck',
      cards: {
        create: [{
          name: 'Bernie Sanders',
          description: 'Should-a been bernie',
          attributeValues: {
            create: [{
              attribute: {
                connect: {
                  id: memeBonus.id,
                }
              },
              value: 99,
            }]
          }
        }]
      },
    },
  })

  const timo = await photon.users.create({
    data: {
      email: 'timo@project-cards.io',
      name: 'Timo',
      trumpPacks: {
        connect: [{
          id: impeachmentPack.id,
        }],
      }
    },
  })

  console.log({ timo })
}

main()
  .catch(e => console.error(e))
  .then(() => photon.disconnect())