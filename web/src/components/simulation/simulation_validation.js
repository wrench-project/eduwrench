export const validateFieldInRange = (className,
                                     value,
                                     minRange,
                                     maxRange,
                                     prefix,
                                     postfix,
                                     valueLambdaFunction) => {

  let label = document.getElementsByClassName(className)[0]
  let updatedText = valueLambdaFunction ? valueLambdaFunction(value) : value
  updatedText = prefix ? prefix + " " + updatedText : updatedText
  updatedText = postfix ? updatedText + " " + postfix : updatedText

  if (!/^[0-9]+$/i.test(value) || value < minRange || value > maxRange) {
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

export const validateFieldInMultipleRanges = (className,
                                              value,
                                              ranges) => {

  for (let index = 0; index < ranges.length; ++index) {
    let range = ranges[index]
    if (value >= range.min && value <= range.max) {
      return validateFieldInRange(className, value, range.min, range.max, range.prefix, range.postfix, range.valueLambdaFunction)
    }
  }

  let label = document.getElementsByClassName(className)[0]
  label.style.backgroundColor = "#ffb7b5"
  label.innerHTML = value
  return false
}
