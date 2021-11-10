//links to pages
const dogLink = document.querySelector('.one')
dogLink.addEventListener('click', ()=> {
    window.open('https://github.com/mrmakki12/Mock-dog-company')
})

const mealsLink = document.querySelector('.two')
mealsLink.addEventListener('click', () => {
    window.open('https://github.com/mrmakki12/Meal-ideas')
})

const dictionaryLink = document.querySelector('.three')
dictionaryLink.addEventListener('click', () => {
    window.open('https://github.com/mrmakki12/Dictionary-api')
})

const githubLink = document.querySelector('.github')
githubLink.addEventListener('click', () => {
    window.open('https://github.com/mrmakki12')
})


// get left and right buttons to scroll with on projects section
const projectsContainer = document.querySelector('.projects-container')
const rightButton = document.querySelector('.right')
const leftButton = document.querySelector('.left')
rightButton.addEventListener('click', () => {
    projectsContainer.scrollBy({top: 0, left: 455, behavior: 'smooth'})
})
leftButton.addEventListener('click', () => {
    projectsContainer.scrollBy({top: 0, left: -455, behavior: 'smooth'})
})


// move the cursor
const cursor = document.querySelector(".cursor")

// get everything that is clickable and change cursor style when hovering clickable elements
const clickables = document.querySelectorAll('.clickable')
clickables.forEach((clickable) => {
    clickable.addEventListener('mouseover', ()=> {
        cursor.classList.add('clickable')
    })
    clickable.addEventListener('mouseout', ()=> {
        cursor.classList.remove('clickable')
    })
})

// move cursor as mouse move
document.addEventListener("mousemove", (e) => {
   cursor.style.left = e.clientX + 'px'
   cursor.style.top = e.clientY + 'px'
})


// Get canvas to use with 3js
const canvas = document.getElementById('canvas')


// Resize Canvas
const sizes = {
    width: innerWidth,
    height: innerHeight
}

window.addEventListener('resize', ()=> {
    sizes.width = innerWidth
    sizes.height = innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
})

// Create scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x030029)

// texture loader and get texture for stars and objects
const textureLoader = new THREE.TextureLoader()
const starTexture = textureLoader.load('./star_06.png')
const gradientTexture = textureLoader.load('../3.jpg')
gradientTexture.magFilter = THREE.NearestFilter

// camera 
//group
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

const camera = new THREE.PerspectiveCamera(35, sizes.width/sizes.height)
camera.position.z = 6
cameraGroup.add(camera)

//lights
const light = new THREE.DirectionalLight('#ffffff', 1)
scene.add(light)
light.position.set(1, 2, 0)

// Renderer
const renderer = new THREE.WebGL1Renderer({
    canvas: canvas,
    
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Objects and particles
 */

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshToonMaterial({ color: '#ff00ff', gradientMap: gradientTexture })
)
scene.add(cube)
cube.position.x = -1.5

const octahedron = new THREE.Mesh(
    new THREE.OctahedronGeometry(.75, 0),
    new THREE.MeshToonMaterial({color: '#ffff00', gradientMap: gradientTexture})
)
scene.add(octahedron)
octahedron.position.x = 1.5
octahedron.position.y = -4

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(.75, 0.4, 32, 50),
    new THREE.MeshToonMaterial({color: '#00ffff', gradientMap: gradientTexture})
)
scene.add(torus)
torus.position.x = 1.5
torus.position.y = -12




//Particles 
const particles = 1000
const positions = new Float32Array(particles * 3)

for(let i = 0; i < particles; i++){
    positions[i * 3 + 0] = (Math.random() - 0.5) * 10
    positions[i * 3 + 1] = (Math.random() - 0.5) * 50
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10
}

const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

const particlesMaterial = new THREE.PointsMaterial( {
    color: 0xffffff,
    sizeAttenuation: true,
    transparent: true,
    alphaMap: starTexture,
    size: 0.3,
    map: starTexture
})

const particles1 = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles1)

// cursor(different from previous) used to animate camera
const cursor1 = {
    x: 0,
    y: 0
}

window.addEventListener('mousemove', (e) => {
    cursor1.x = e.clientX /sizes.width - 0.5
    cursor1.y = e.clientY /sizes.height - 0.5
})

/**
 * animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () => {
    let scrollY = window.scrollY
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    cube.rotation.x += deltaTime
    cube.rotation.y += deltaTime
    octahedron.rotation.y += deltaTime
    torus.rotation.y += deltaTime

    camera.position.y = -scrollY / (sizes.height / 4)
    const parallaxX = cursor1.x
    const parallaxY = cursor1.y
    cameraGroup.position.x += (parallaxX -cameraGroup.position.x) * 3 * deltaTime
    cameraGroup.position.y += (parallaxY -cameraGroup.position.y) * 3 * deltaTime
    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)

}

tick()