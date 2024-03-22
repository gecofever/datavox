export const removePage = () => {
  const tableSection = document.getElementById('tableSection')
  if (tableSection) {    
    const divs = tableSection.querySelectorAll('.a4')
    const lastDiv = divs[divs.length - 1]
    const penultimateDiv = divs[divs.length - 2]

    if (lastDiv) {
      lastDiv.remove()
      penultimateDiv.remove()
    }    
  }
}
