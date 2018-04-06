export function CharacterLimit(control, limit) {
  var field = 'invalid' + control;
  return control => {
      return control.value.toString().length <= limit ? null : { field  : true }
  }
}

export function fuuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}