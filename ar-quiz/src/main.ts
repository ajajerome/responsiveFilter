import './style.css'

import * as THREE from 'three'

type QuizItem = {
  id: string
  question: string
  answers: string[]
  correctIndex: number
  color: string
  matrix: number[]
}

const appRoot = document.querySelector<HTMLDivElement>('#app')!

appRoot.innerHTML = `
  <div class="ui">
    <div class="top-bar">
      <button id="start-ar" type="button">Start AR</button>
      <button id="create-quiz" type="button">Create Quiz</button>
    </div>
    <div id="status" class="status"></div>
  </div>
  <div id="modal" class="modal hidden">
    <div class="modal-content">
      <h2>Create Quiz</h2>
      <form id="quiz-form">
        <label>Question<input id="q-question" required placeholder="Type your question" /></label>
        <label>Answer A<input id="q-a" required placeholder="Option A" /></label>
        <label>Answer B<input id="q-b" required placeholder="Option B" /></label>
        <label>Answer C<input id="q-c" placeholder="Option C (optional)" /></label>
        <label>Answer D<input id="q-d" placeholder="Option D (optional)" /></label>
        <label>Correct Answer Index (0-3)<input id="q-correct" type="number" min="0" max="3" value="0" required /></label>
        <div class="modal-actions">
          <button type="button" id="cancel-create">Cancel</button>
          <button type="submit">Next: Place</button>
        </div>
      </form>
    </div>
  </div>
  <div id="answer" class="modal hidden">
    <div class="modal-content">
      <h2 id="a-title">Question</h2>
      <div id="a-options" class="answers"></div>
      <div class="modal-actions">
        <button id="a-close" type="button">Close</button>
      </div>
    </div>
  </div>
`

const startArBtn = document.getElementById('start-ar') as HTMLButtonElement
const createQuizBtn = document.getElementById('create-quiz') as HTMLButtonElement
const statusEl = document.getElementById('status') as HTMLDivElement

const modal = document.getElementById('modal') as HTMLDivElement
const modalCloseBtn = document.getElementById('cancel-create') as HTMLButtonElement
const quizForm = document.getElementById('quiz-form') as HTMLFormElement
const qQuestion = document.getElementById('q-question') as HTMLInputElement
const qA = document.getElementById('q-a') as HTMLInputElement
const qB = document.getElementById('q-b') as HTMLInputElement
const qC = document.getElementById('q-c') as HTMLInputElement
const qD = document.getElementById('q-d') as HTMLInputElement
const qCorrect = document.getElementById('q-correct') as HTMLInputElement

const answerModal = document.getElementById('answer') as HTMLDivElement
const answerTitle = document.getElementById('a-title') as HTMLHeadingElement
const answerOptions = document.getElementById('a-options') as HTMLDivElement
const answerClose = document.getElementById('a-close') as HTMLButtonElement

let xrSupported = false
let renderer: THREE.WebGLRenderer
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let reticle: THREE.Mesh
let hitTestSource: XRHitTestSource | null = null
let viewerSpace: XRReferenceSpace | null = null
let localSpace: XRReferenceSpace | null = null
let controller: THREE.Group
let raycaster: THREE.Raycaster
let placementMode = false
let pendingQuiz: Omit<QuizItem, 'id' | 'matrix'> | null = null
const quizObjects: THREE.Object3D[] = []

function setStatus(message: string) {
  statusEl.textContent = message
}

async function checkXrSupport() {
  const xr: any = (navigator as any).xr
  xrSupported = !!xr && await xr.isSessionSupported('immersive-ar')
  if (!xrSupported) setStatus('WebXR AR not supported in this browser/device')
}

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

function saveQuizzes() {
  const items: QuizItem[] = quizObjects.map(obj => {
    const q = obj.userData.quiz as Omit<QuizItem, 'matrix' | 'id'> & { id: string }
    const m = new THREE.Matrix4().copy(obj.matrix)
    return { id: q.id, question: q.question, answers: q.answers, correctIndex: q.correctIndex, color: q.color, matrix: m.toArray() }
  })
  localStorage.setItem('ar-quiz-items', JSON.stringify(items))
}

function loadQuizzes(): QuizItem[] {
  try {
    const raw = localStorage.getItem('ar-quiz-items')
    return raw ? JSON.parse(raw) as QuizItem[] : []
  } catch {
    return []
  }
}

function createQuizMesh(color: string) {
  const geometry = new THREE.SphereGeometry(0.05, 24, 16)
  const material = new THREE.MeshStandardMaterial({ color })
  const mesh = new THREE.Mesh(geometry, material)
  const base = new THREE.ConeGeometry(0.03, 0.06, 16)
  const baseMat = new THREE.MeshStandardMaterial({ color: '#666666', metalness: 0.2, roughness: 0.8 })
  const baseMesh = new THREE.Mesh(base, baseMat)
  baseMesh.position.y = -0.07
  mesh.add(baseMesh)
  mesh.castShadow = true
  mesh.receiveShadow = true
  return mesh
}

function showModal(el: HTMLElement) {
  el.classList.remove('hidden')
}
function hideModal(el: HTMLElement) {
  el.classList.add('hidden')
}

async function startAR() {
  if (!xrSupported) return

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.xr.enabled = true
  document.body.appendChild(renderer.domElement)

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20)

  const light = new THREE.HemisphereLight(0xffffff, 0xbbbbbb, 1.0)
  scene.add(light)

  const dir = new THREE.DirectionalLight(0xffffff, 0.8)
  dir.position.set(0.5, 1, 0.5)
  scene.add(dir)

  const ringGeo = new THREE.RingGeometry(0.06, 0.07, 32)
  const ringMat = new THREE.MeshBasicMaterial({ color: '#00ffa2' })
  reticle = new THREE.Mesh(ringGeo, ringMat)
  reticle.rotation.x = -Math.PI / 2
  reticle.matrixAutoUpdate = false
  reticle.visible = false
  scene.add(reticle)

  controller = renderer.xr.getController(0)
  scene.add(controller)

  raycaster = new THREE.Raycaster()

  ;(controller as any).addEventListener('select', onSelect)

  window.addEventListener('resize', onWindowResize)

  const session = await (navigator as any).xr.requestSession('immersive-ar', {
    requiredFeatures: ['hit-test'],
    optionalFeatures: ['dom-overlay'],
    domOverlay: { root: document.body }
  } as any)

  renderer.xr.setReferenceSpaceType('local')
  await renderer.xr.setSession(session)

  const refSpace = await session.requestReferenceSpace('local')
  localSpace = refSpace
  viewerSpace = await session.requestReferenceSpace('viewer' as any)
  if (viewerSpace) {
    const hitSource = await (session as any).requestHitTestSource({ space: viewerSpace })
    hitTestSource = (hitSource as XRHitTestSource) ?? null
  }

  session.addEventListener('end', () => {
    hitTestSource?.cancel()
    hitTestSource = null
    viewerSpace = null
    localSpace = null
    while (quizObjects.length) quizObjects.pop()
    renderer.dispose()
    setStatus('AR session ended')
  })

  // Restore any saved quizzes (positions are approximate across sessions)
  const saved = loadQuizzes()
  for (const item of saved) {
    const mesh = createQuizMesh(item.color)
    mesh.matrix.fromArray(item.matrix)
    mesh.matrixAutoUpdate = false
    mesh.userData.quiz = { id: item.id, question: item.question, answers: item.answers, correctIndex: item.correctIndex, color: item.color }
    quizObjects.push(mesh)
    scene.add(mesh)
  }

  renderer.setAnimationLoop(render)
  setStatus('Move device to find a surface. Use Create Quiz to place.')
}

function onWindowResize() {
  if (!renderer || !camera) return
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

function onSelect() {
  if (!renderer.xr.isPresenting) return

  if (placementMode && reticle.visible && pendingQuiz) {
    const color = `hsl(${Math.floor(Math.random() * 360)}, 80%, 55%)`
    const mesh = createQuizMesh(color)
    mesh.matrix.copy(reticle.matrix)
    mesh.matrixAutoUpdate = false
    const item = { id: uid(), question: pendingQuiz.question, answers: pendingQuiz.answers, correctIndex: pendingQuiz.correctIndex, color }
    mesh.userData.quiz = item
    scene.add(mesh)
    quizObjects.push(mesh)
    placementMode = false
    pendingQuiz = null
    setStatus('Placed quiz. Tap object to answer.')
    saveQuizzes()
    return
  }

  // Raycast to select existing quiz objects
  const tempMatrix = new THREE.Matrix4()
  tempMatrix.identity().extractRotation(controller.matrixWorld)
  raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld)
  raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix)
  const intersects = raycaster.intersectObjects(quizObjects, true)
  if (intersects.length > 0) {
    const obj = intersects[0].object
    const root = obj.parent && quizObjects.includes(obj.parent) ? obj.parent : obj
    const q = (root as THREE.Object3D).userData.quiz as QuizItem
    openAnswer(q)
  }
}

function render(_: any, frame?: XRFrame) {
  if (!frame || !localSpace || !hitTestSource) {
    renderer.render(scene, camera)
    return
  }
  const results = frame.getHitTestResults(hitTestSource)
  if (results.length > 0) {
    const pose = results[0].getPose(localSpace)
    if (pose) {
      reticle.visible = true
      reticle.matrix.fromArray(pose.transform.matrix as unknown as number[])
    }
  } else {
    reticle.visible = false
  }
  renderer.render(scene, camera)
}

function openAnswer(item: QuizItem) {
  answerTitle.textContent = item.question
  answerOptions.innerHTML = ''
  item.answers.forEach((ans, idx) => {
    const btn = document.createElement('button')
    btn.textContent = ans
    btn.className = 'answer-btn'
    btn.onclick = () => {
      const correct = idx === item.correctIndex
      btn.classList.add(correct ? 'correct' : 'wrong')
      setTimeout(() => hideModal(answerModal), 900)
    }
    answerOptions.appendChild(btn)
  })
  showModal(answerModal)
}

function openCreateQuiz() {
  qQuestion.value = ''
  qA.value = ''
  qB.value = ''
  qC.value = ''
  qD.value = ''
  qCorrect.value = '0'
  showModal(modal)
}

function handleCreateSubmit(e: Event) {
  e.preventDefault()
  const answers = [qA.value, qB.value, qC.value, qD.value].filter(v => v && v.trim().length > 0)
  const correctIndex = parseInt(qCorrect.value, 10)
  if (answers.length < 2) {
    alert('Please provide at least two answers')
    return
  }
  if (Number.isNaN(correctIndex) || correctIndex < 0 || correctIndex >= answers.length) {
    alert('Correct index must reference an existing answer')
    return
  }
  pendingQuiz = { question: qQuestion.value, answers, correctIndex, color: '#ffffff' }
  placementMode = true
  hideModal(modal)
  setStatus('Look for the reticle and tap to place the quiz')
}

modalCloseBtn.onclick = () => hideModal(modal)
answerClose.onclick = () => hideModal(answerModal)
quizForm.addEventListener('submit', handleCreateSubmit)
createQuizBtn.onclick = openCreateQuiz
startArBtn.onclick = startAR

checkXrSupport()
