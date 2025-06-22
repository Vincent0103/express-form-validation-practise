class UsersStorage {
  constructor() {
    this.storage = {};
    this.id = 0;
  }

  addUser({ firstName, lastName, mail, age, bio }) {
    const id = this.id;
    this.storage[id] = { id, firstName, lastName, mail, age, bio };
    this.id++;
  }

  getUsers(name, email) {
    return Object.values(this.storage).filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      const nameMatch = (name) ? fullName.includes(name.toLowerCase()) : true;
      const emailMatch = (email) ? user.mail === email : true;
      return nameMatch && emailMatch;
    });
  }

  getUser(id) {
    return this.storage[id];
  }

  updateUser(id, { firstName, lastName, mail, age, bio }) {
    this.storage[id] = { id, firstName, lastName, mail, age, bio };
  }

  deleteUser(id) {
    delete this.storage[id];
  }
}

export default new UsersStorage();
