export function CharacterLimit(control, limit) {
  var field = 'invalid' + control;
  return control => {
      return control.value.toString().length <= limit ? null : { field  : true }
  }
}