export const validateFieldInRange = (className,
                                     value,
                                     minRange,
                                     maxRange,
                                     prefix,
                                     postfix,
                                     valueLambdaFunction) => {

  let label = document.getElementsByClassName(className)[0]
  let updatedText = valueLambdaFunction ? valueLambdaFunction(value) : value
  updatedText = prefix ? prefix + " " + value : value
  updatedText = postfix ? updatedText + " " + postfix : updatedText

  if (!value || !/^[0-9]+$/i.test(value) || value < minRange || value > maxRange) {
    label.style.backgroundColor = "#ffb7b5"
    label.innerHTML = updatedText
    return false
  }

  if (label.innerHTML !== updatedText) {
    label.innerHTML = updatedText
    label.style.backgroundColor = "rgb(211, 255, 233)"
    setTimeout(function() {
      if (label.style.backgroundColor === "rgb(211, 255, 233)") {
        label.style.backgroundColor = ""
      }
    }, 500)
  }

  return true
}
