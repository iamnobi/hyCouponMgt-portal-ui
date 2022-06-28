export class MenuItem {
  _title;
  _link;
  _icon;
  _show;
  _subMenus;

  constructor(title, link, icon, show = false, subMenus = null) {
    if (typeof title !== 'string')
      throw new TypeError("'title' has to be a string");

    if (typeof link !== 'string')
      throw new TypeError("'link' has to be a string");

    if (typeof icon !== 'string')
      throw new TypeError("'icon' has to be a string");

    if (typeof show !== 'boolean')
      throw new TypeError("'show' has to be a boolean");

    this._title = title;
    this._link = link;
    this._icon = icon;
    this._show = show;

    if (Array.isArray(subMenus)) this._subMenus = subMenus;
  }

  get icon() {
    return this._icon;
  }

  get title() {
    return this._title;
  }

  get link() {
    return this._link;
  }

  get show() {
    return this._show;
  }

  get subMenus() {
    return this._subMenus;
  }
}
