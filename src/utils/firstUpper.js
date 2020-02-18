export default string => {
  string = string + ''; // force string
  string = string.replace(/\s/g, '');
  return string.charAt(0).toUpperCase() + string.slice(1);
};
