const floatingForm = document.getElementById('floatingForm')

const titleInput = document.getElementById('title')
const titleValueSpan = document.getElementById('titleValue')

const cityInput = document.getElementById('city')
const cityValueSpans = document.querySelectorAll('.cityValue')

const dateInput = document.getElementById('date')
const dateValueSpan = document.getElementById('dateValue')

const zoneInput = document.getElementById('zone')
const zoneValueSpan = document.getElementById('zoneValue')

const numberInterviewsInput = document.getElementById('numberInterviews')
const numberInterviewsValueSpan = document.getElementById('numberInterviewsValue')

const copyrightInput = document.getElementById('copyright')
const copyrightValueSpan = document.getElementById('copyrightValue')

export const saveChanges = () => {
  const titleValue = titleInput.value || 'Título'
  const cityValue = cityInput.value || 'Cidade'
  const dateValue = dateInput.value || 'Data'
  const numberInterviewsValue = numberInterviewsInput.value || '0'
  const zoneValue = zoneInput.value || 'Urbana e Rural'
  const copyrightValue = copyrightInput.value || ''

  titleValueSpan.textContent = titleValue

  cityValueSpans.forEach((span) => {
    span.textContent = cityValue
  })

  dateValueSpan.textContent = dateValue
  numberInterviewsValueSpan.textContent = numberInterviewsValue
  zoneValueSpan.textContent = zoneValue
  copyrightValueSpan.textContent = copyrightValue

  floatingForm.classList.add('hidden')
}
