const v = {
  isNumber:     x => typeof x === "number" && !Number.isNaN(x),
  isString:     x => typeof x === "string",
  isObject:     x => typeof x === "object",
  defined:      x => x !== undefined,
  required:     x => v.isNumber(x) || !!x,
  requiredText: x => v.isString(x) && v.required(x),

  isPassword: x => v.isString(x) && x.length > 8,
  isId:       x => v.isString(x) && v.required(x),
  isEmail:    x => v.requiredText(x) && x.includes("@") && x.includes("."),
  isUrl:      x => v.requiredText(x) && x.includes("."),
  hasOptions: x => typeof x.options === "object" && x.options instanceof Array
    && x.options.length > 1 && x.options.every(v.requiredText),

  isImage:  x => !v.defined(x) || v.requiredText(x),
  isSurvey: x => !v.defined(x) || v.isObject(x) && v.hasOptions(x),
  isvideo:  x => !v.defined(x) || v.isUrl(x) && (x.includes("youtube") || x.includes("youtu.be")),

  isNewReddit: x => v.requiredText(x.name),
  isAnswer:    x => v.isObject(x) && v.isNumber(x.answer),

  isNewUser: x => {
    const { username, password, email } = x;
    return v.requiredText(username) && v.isPassword(password) && v.isEmail(email);
  },

  isNewPost: x => {
    const { name, text, image, video, survey } = x;
    return v.requiredText(name) && v.requiredText(text)
      && v.isImage(image) && v.isvideo(video) && v.isSurvey(survey);
  },

  isComment: x => {
    const { user, text } = x;
    return v.isObject(user) && v.isId(user.id) && v.requiredText(text);
  }
};

module.exports = {
  pagination: req => ({ query: req.query.q || "", page: req.query.p  || 0 }),
  validator: v,
  limit: page => `LIMIT 10 OFFSET ${page * 10}`,
  newestOrder: "ORDER BY creation_date DESC"
};
