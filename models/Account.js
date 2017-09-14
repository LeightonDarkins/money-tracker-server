class Account {
  withName (name) {
    this.name = name
    return this
  }

  withBalance (balance) {
    this.balance = +balance
    return this
  }
}

module.exports = Account
