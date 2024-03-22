const floatingForm = document.getElementById('floatingForm')

const titleInput = document.getElementById('title')
const titleValueSpan = document.getElementById('titleValue')

const cityInput = document.getElementById('city')
const cityValueSpans = document.querySelectorAll('.cityValue')

const dateInput = document.getElementById('date')
const dateValueSpan = document.getElementById('dateValue')

const zoneInput = document.getElementById('zone')
const zoneValueSpan = document.getElementById('zoneValue')

const ruralLocationsInput = document.getElementById('ruralLocations')
const ruralLocationsValueSpan = document.getElementById('ruralLocationsValue')

const districtsInput = document.getElementById('districts')
const districtsValueSpan = document.getElementById('districtsValue')

const numberInterviewsInput = document.getElementById('numberInterviews')
const numberInterviewsValueSpan = document.getElementById(
  'numberInterviewsValue',
)

export const saveChanges = () => {
  const titleValue = titleInput.value || 'Título'
  const cityValue = cityInput.value || 'Cidade'
  const dateValue = dateInput.value || 'Data'
  const numberInterviewsValue = numberInterviewsInput.value || '0'
  const zoneValue = zoneInput.value || 'Urbana e Rural'
  const ruralLocationsValue = ruralLocationsInput.value || 'Localidades rurais'
  const districtsValue = districtsInput.value || 'Bairros'

  titleValueSpan.textContent = titleValue
  
  cityValueSpans.forEach((span) => {
    span.textContent = cityValue
  })
  
  dateValueSpan.textContent = dateValue
  numberInterviewsValueSpan.textContent = numberInterviewsValue
  zoneValueSpan.textContent = zoneValue
  ruralLocationsValueSpan.textContent = ruralLocationsValue
  districtsValueSpan.textContent = districtsValue

  floatingForm.classList.add('hidden')
}
