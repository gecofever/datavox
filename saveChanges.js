const floatingForm = document.getElementById('floatingForm')

const titleInput = document.getElementById('title')
const titleValueSpan = document.getElementById('titleValue')

const cityInput = document.getElementById('city')
const cityValueSpan = document.getElementById('cityValue')

const dateInput = document.getElementById('date')
const dateValueSpan = document.getElementById('dateValue')

const numberInterviewsInput = document.getElementById('numberInterviews')
const numberInterviewsValueSpan = document.getElementById(
  'numberInterviewsValue',
)

export const saveChanges = () => {
  const titleValue = titleInput.value || 'Título'
  const cityValue = cityInput.value || 'Cidade'
  const dateValue = dateInput.value || 'Data'
  const numberInterviewsValue = numberInterviewsInput.value || '0'

  titleValueSpan.textContent = titleValue
  cityValueSpan.textContent = cityValue
  dateValueSpan.textContent = dateValue
  numberInterviewsValueSpan.textContent = numberInterviewsValue

  floatingForm.classList.add('hidden')
}
