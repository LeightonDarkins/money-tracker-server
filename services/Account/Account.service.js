module.exports = class AccountService {
  constructor (logger, AccountDB, TransactionDB) {
    this.logger = logger
    this.AccountDB = AccountDB
    this.TransactionDB = TransactionDB
  }

  createAccountWithInitialBalance (account) {
    this.logger.info(`${this.constructor.name} creating account with initial balance`)

    return this.AccountDB.create(account)
      .then(account => this._createInitialTransaction(account._id, account.openingBalance))
  }

  _createInitialTransaction (account, amount) {
    this.logger.info(`${this.constructor.name} creating initial transaction for account: ${account}`)

    amount = amount === null || amount === undefined || isNaN(amount) ? 0 : amount

    const initialTransaction = {
      amount,
      category: '59dd17f5549f1471ed426c31',
      account: account,
      date: Date.now()
    }

    return this.TransactionDB.create(initialTransaction)
  }

  getAccountBalance (accountID) {
    this.logger.info(`${this.constructor.name} getting balance for account: ${accountID}`)

    return this.TransactionDB.findByAccountId({ account: accountID }).then(transactions => {
      return transactions.reduce((a, b) => a + b.amount, 0)
    })
  }
}
