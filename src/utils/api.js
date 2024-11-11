class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  getAppInfo() {
    return Promise.all([this.getInitialCards(), this.getUserInfo()]);
  }

  getUserInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
      headers: this._headers,
      authorization: "30ff8961-85ac-4950-ab32-fdec188893a8",
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      Promise.reject(`Error:${res.status}`);
    });
  }

  addCard({ name, link }) {
    return fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: this._headers,
      authorization: "30ff8961-85ac-4950-ab32-fdec188893a8",
      body: JSON.stringify({
        name: name, // The title or name of the card
        link: link, // The URL or link to the image
      }),
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      Promise.reject(`Error:${res.status}`);
    });
  }

  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
      headers: this._headers,
      authorization: "30ff8961-85ac-4950-ab32-fdec188893a8",
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      Promise.reject(`Error:${res.status}`);
    });
  }
  editUserInfo({ name, about }) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._headers,
      authorization: "30ff8961-85ac-4950-ab32-fdec188893a8",
      body: JSON.stringify({
        name,
        about,
      }),
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      Promise.reject(`Error:${res.status}`);
    });
  }

  editAvatarInfo(avatar) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      authorization: "30ff8961-85ac-4950-ab32-fdec188893a8",
      body: JSON.stringify({ avatar }),
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      Promise.reject(`Error:${res.status}`);
    });
  }
  deleteCard(id) {
    return fetch(`${this._baseUrl}/cards/${id}`, {
      method: "DELETE",
      headers: this._headers,
      authorization: "30ff8961-85ac-4950-ab32-fdec188893a8",
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      Promise.reject(`Error:${res.status}`);
    });
  }

  changeLikeStatus(id, isLiked) {
    return fetch(`${this._baseUrl}/cards/${id}/likes`, {
      method: isLiked ? "DELETE" : "PUT",
      headers: this._headers,
      authorization: "30ff8961-85ac-4950-ab32-fdec188893a8",
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      Promise.reject(`Error:${res.status}`);
    });
  }
}

export default Api;
