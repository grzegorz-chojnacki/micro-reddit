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

  isImage:  x => !v.defined(x) || v.requiredText(x),
  isvideo:  x => !v.defined(x) || v.isUrl(x) && (x.includes("youtube") || x.includes("youtu.be")),

  isNewReddit: x => v.requiredText(x.name),

  isNewUser: x => {
    const { username, password, email } = x;
    return v.requiredText(username) && v.isPassword(password) && v.isEmail(email);
  },

  isNewPost: x => {
    const { title, content, image, video } = x;
    return v.requiredText(title) && v.requiredText(content)
      && v.isImage(image) && v.isvideo(video);
  },

  isComment: x => {
    const { user, content } = x;
    return v.isObject(user) && v.isId(user.id) && v.requiredText(content);
  }
};

module.exports = {
  pagination: req => ({ query: req.query.q || "", page: req.query.p  || 0 }),
  validator: v,
  limit: page => `LIMIT 10 OFFSET ${page * 10}`,
  newestOrder: "ORDER BY creation_date DESC"
};
