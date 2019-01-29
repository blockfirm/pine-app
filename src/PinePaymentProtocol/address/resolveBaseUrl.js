const SUBDOMAIN_KEY = '_pine';
const LOCAL_PORT = 50428;

/**
 * The purpose of this function is not to validate the domain name,
 * but solely to classify whether it's intended as a domain name or
 * not. Proper hostname validation is deferred to the client making
 * the request.
 */
const isDomainName = (hostname) => {
  return /\.[a-z]+$/i.test(hostname);
};

/**
 * Resolves a base URL from a hostname.
 *
 * @param {string} hostname - A hostname from a Pine Address.
 *
 * @returns {string} A base URL that can be used to make API calls to a Pine Payment Server.
 */
const resolveBaseUrl = (hostname) => {
  if (!hostname || typeof hostname !== 'string') {
    throw new Error('The hostname must be a non-empty string');
  }

  if (isDomainName(hostname)) {
    /**
     * If the hostname is a domain name, use HTTPS and prepend a subdomain.
     * E.g. example.com would resolve to https://_pine.example.com.
     */
    return `https://${SUBDOMAIN_KEY}.${hostname}`;
  }

  /**
   * If the hostname is an IP number or a local domain such as localhost,
   * use HTTP and a local port number. Intended for testing purposes.
   *
   * E.g.:
   * - 192.168.0.20 would resolve to http://192.168.0.20:50428
   * - localhost would resolve to http://localhost:50428
   */
  return `http://${hostname}:${LOCAL_PORT}`;
};

export default resolveBaseUrl;
