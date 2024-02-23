export const removePage = () => {
  const tableSection = document.getElementById('tableSection')
  if (tableSection) {    
    const divs = tableSection.querySelectorAll('.a4')
    const lastDiv = divs[divs.length - 1]

    if (lastDiv) {
      lastDiv.remove()
    }    
  }
}
