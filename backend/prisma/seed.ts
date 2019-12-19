import { Photon } from '@prisma/photon'
const photon = new Photon()

async function main() {
}

main()
  .catch(e => console.error(e))
  .then(() => photon.disconnect())