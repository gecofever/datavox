const floatingForm = document.getElementById('floatingForm')

const cityInput = document.getElementById('city')
const cityValueSpans = document.querySelectorAll('.cityValue')

const dateInput = document.getElementById('date')
const dateValueSpan = document.getElementById('dateValue')


const numberInterviewsInput = document.getElementById('numberInterviews')
const numberInterviewsValueSpan = document.getElementById('numberInterviewsValue')

const copyrightInput = document.getElementById('copyright')
const copyrightValueSpan = document.getElementById('copyrightValue')

export const saveChanges = () => {
  const cityValue = cityInput.value || 'Cidade'
  const dateValue = dateInput.value || 'Data'
  const numberInterviewsValue = numberInterviewsInput.value || '0'
  const copyrightValue = copyrightInput.value || ''

  cityValueSpans.forEach((span) => {
    span.textContent = cityValue
  })

  dateValueSpan.textContent = dateValue
  numberInterviewsValueSpan.textContent = numberInterviewsValue
  copyrightValueSpan.textContent = copyrightValue

  floatingForm.classList.add('hidden')
}
