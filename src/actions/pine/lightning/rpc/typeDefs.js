/**
 * TransactionInput contains information about an output to be used
 * as an input to a new transaction.
 *
 * @typedef {Object} TransactionInput
 * @property {Buffer} transactionHash - Hash of transaction where the input was created as an output.
 * @property {number} index - Index of the output in the above transaction.
 * @property {Buffer} signatureScript - Signature script of the output.
 * @property {Buffer[]} witness - Witness data for the output.
 * @property {number} sequence - Sequence number of origin transaction.
 */

/**
 * TransactionOutput contains information about an output for a new
 * transaction.
 *
 * @typedef {Object} TransactionOutput
 * @property {string} value - Value in satoshis.
 * @property {Buffer} pkScript - Public key script that will lock this output.
 */

/**
 * Transaction contains information about a bitcoin transaction.
 *
 * @typedef {Object} Transaction
 * @property {number} version - Transaction version.
 * @property {TransactionInput[]} inputs - Transaction inputs.
 * @property {TransactionOutput[]} outputs - Transaction outputs.
 * @property {number} lockTime - Transaction lock time.
*/

/**
 * TransactionSigHashes contains three different signature hashes.
 *
 * @typedef {Object} TransactionSigHashes
 * @property {Buffer} hashPrevOuts
 * @property {Buffer} hashSequence
 * @property {Buffer} hashOutputs
 */

/**
 * SignDescriptor describes how to sign a Transaction.
 *
 * @typedef {Object} SignDescriptor
 * @property {KeyDescriptor} keyDescriptor - Description of how to derive key to sign with.
 * @property {Buffer} singleTweak - Single tweak to apply to the signing key.
 * @property {Buffer} doubleTweak - Double tweak to apply to the signing key.
 * @property {Buffer} witnessScript - Witness script.
 * @property {TransactionOutput} output - Transaction output that should be signed.
 * @property {number} hashType - Enum, see top of this file for mapping.
 * @property {TransactionSigHashes} sigHashes - Transaction signature hashes to use when signing.
 * @property {number} inputIndex - Transaction input index to sign.
 */
