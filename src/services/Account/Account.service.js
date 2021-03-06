const _ = require('lodash')

module.exports = class AccountService {
  constructor (logger, AccountDB, TransactionDB, date) {
    this.logger = logger
    this.AccountDB = AccountDB
    this.TransactionDB = TransactionDB
    this.Date = date
  }

  createAccountWithInitialBalance (account) {
    this.logger.info(`${this.constructor.name} creating account with initial balance`)

    return this.AccountDB.create(account)
      .then(resultAccount => {
        this._createInitialTransaction(resultAccount._id, resultAccount.openingBalance)
      })
  }

  _createInitialTransaction (account, amount) {
    this.logger.info(`${this.constructor.name} creating initial transaction for account: ${account}`)

    amount = amount === null || amount === undefined || isNaN(amount) ? 0 : amount

    const initialTransaction = {
      amount,
      category: '59dd17f5549f1471ed426c31',
      account: account,
      date: new this.Date().setHours(0, 0, 0, 0)
    }

    console.log(`creating initial tranaction: ${initialTransaction.date}`)

    return this.TransactionDB.create(initialTransaction)
  }

  getAccounts () {
    return this.AccountDB.find()
      .then(accounts => {
        return this._applyBalancesToAccounts(accounts)
      })
      .catch(error => {
        return error
      })
  }

  _applyBalancesToAccounts (accounts) {
    return this._getAccountBalances(accounts)
      .then((balances) => {
        this.logger.info(`${this.constructor.name} applying balances to accounts`)

        for (let x = 0; x < balances.length; x++) {
          accounts[x].balance = balances[x]
        }

        return accounts
      })
  }

  _getAccountBalances (accounts) {
    this.logger.info(`${this.constructor.name} getting balances for accounts`)

    let promises = []

    _.each(accounts, (account) => {
      promises.push(this.getAccountBalance(account._id))
    })

    return Promise.all(promises)
  }

  getAccountBalance (accountID) {
    this.logger.info(`${this.constructor.name} getting balance for account: ${accountID}`)

    return this.TransactionDB.findByAccountId({ account: accountID }).then(transactions => {
      return transactions.reduce((a, b) => a + b.amount, 0)
    })
  }

  getAccountWithBalance (accountID) {
    this.logger.info(`${this.constructor.name} getting account: ${accountID} with balance`)

    return this.AccountDB.find(accountID)
      .then((accounts) => {
        if (accounts.length === 0) throw new Error('NOT FOUND')

        return this._applyBalancesToAccounts(accounts)
      })
  }

  deleteAccount (accountID) {
    this.logger.warn(`${this.constructor.name} deleting account: ${accountID}`)

    return this.AccountDB.delete(accountID)
  }

  deleteAccounts (accountID) {
    this.logger.warn(`${this.constructor.name} deleting accounts`)

    return this.AccountDB.delete()
  }

  updateAccount (accountID, account) {
    this.logger.warn(`${this.constructor.name} updating account: ${accountID}`)

    return this.AccountDB.update({ id: accountID, account: account })
  }

  getTransactionsForAccount (accountID) {
    this.logger.info(`${this.constructor.name} getting transactions for account: ${accountID}`)

    return this.TransactionDB.findByAccountId({ account: accountID })
      .then(transactions => {
        return transactions
      })
  }
}
