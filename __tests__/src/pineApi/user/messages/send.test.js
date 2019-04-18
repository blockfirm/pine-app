import sendMessage from '../../../../../src/pineApi/user/messages/send';

global.fetch = jest.fn(() => Promise.resolve({
  ok: true,
  json: () => Promise.resolve({
    id: 'c86673d7-8f7a-43b7-ad14-fd980dc998a2'
  })
}));

describe('send', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('is a function', () => {
    expect(typeof sendMessage).toBe('function');
  });

  it('accepts three arguments', () => {
    expect(sendMessage.length).toBe(3);
  });

  describe('when sending a message', () => {
    let message;
    let contact;
    let credentials;

    beforeEach(() => {
      message = {
        version: 1,
        type: 'payment',
        data: {}
      };

      contact = {
        address: 'to@pine.pm',
        userId: '8YZpTYqxzY4XvNUBx1o4skSCz9rTJquyD',
        publicKey: '6QXA9rJB1HT8NaezaAD7UKSVUirwLvGrwhUgpszaRPvbRdMohE'
      };

      credentials = {
        address: 'from@pine.pm',
        mnemonic: 'test boss fly battle rubber wasp afraid party whale hamster chicken vibrant'
      };

      return sendMessage(message, contact, credentials);
    });

    describe('the HTTP request', () => {
      it('is made to the url https://_pine.pine.pm/v1/users/8YZpTYqxzY4XvNUBx1o4skSCz9rTJquyD/messages', () => {
        const expectedUrl = 'https://_pine.pine.pm/v1/users/8YZpTYqxzY4XvNUBx1o4skSCz9rTJquyD/messages';
        expect(fetch).toHaveBeenCalledWith(expectedUrl, expect.anything());
      });

      describe('the request options', () => {
        let options;

        beforeEach(() => {
          options = fetch.mock.calls[0][1];
        });

        it('is an object', () => {
          expect(typeof options).toBe('object');
          expect(options).toBeTruthy();
        });

        it('has "method" set to "POST"', () => {
          expect(options.method).toBe('POST');
        });

        it('has header "Content-Type" set to "application/json"', () => {
          expect(options.headers).toBeTruthy();
          expect(options.headers['Content-Type']).toBe('application/json');
        });

        it('has header "Authorization" set to a signature of the request', () => {
          expect(options.headers).toBeTruthy();
          expect(options.headers['Authorization']).toBe('Basic ZnJvbUBwaW5lLnBtOkgraVNlS2pzaWlQUHhFN2k5bGlkVzJjRUJqT2QyTGF1MFpBMytlcy9nMzUwYjhzUElwK05hckw5aklsdGhPMjVxbS90MVBodUF2SnJjRjl3Z0srMWIxcz0=');
        });

        describe('the body', () => {
          it('is a JSON string', () => {
            const body = JSON.parse(options.body);
            expect(typeof body).toBe('object');
          });

          it('has encryptedMessage set to the encrypted message', () => {
            const body = JSON.parse(options.body);
            expect(body.encryptedMessage).toBe('eyJpdiI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6WzEsMzUsNjksMTAzLDEzNywxNzEsMjA1LDIzOSwxLDM1LDY5LDEwMywxMzcsMTcxLDIwNSwyMzldfSwiZXBoZW1QdWJsaWNLZXkiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOls0LDcwLDcwLDE3NCw4MCw3MSw0OSwxMDcsNjYsNDgsMjA4LDgsMTA4LDEzOCwyMDYsMTk4LDEzNSwyNDAsMTEsMjgsMjE3LDIwOSwyMjAsOTksNzksMTA4LDE3OSw4OCwxNzIsMTAsMTU0LDE0MywyNTUsMjU0LDExOSwxODAsMjIxLDEwLDc1LDI1MSwxNDksMTMzLDMxLDU5LDExNSw4NSwxOTksMTI5LDIyMSw5NiwyNDgsNjUsMTQzLDIwMCwxNjYsOTMsMjAsMTQ0LDEyMiwyNTUsNzEsMjAxLDMsMTY1LDg5XX0sImNpcGhlcnRleHQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOlsyNTAsMTgsMTg4LDIyNSwxNjgsMTcwLDE4OCwyNiwxODgsMTMwLDcyLDgwLDQ1LDI0OSwyNDksMTY3LDE4Myw2NCwxMzYsMTI0LDE5NCwxMDksMjM2LDIzOCwzLDcsMTIwLDM1LDI0NywyMzcsOTgsMTQ1LDE0OCwxNDYsMTk0LDIwNiwxMTYsMjE5LDE2MCwxMTgsMjcsMjE5LDg5LDY0LDM4LDI1MiwxOTksMTRdfSwibWFjIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjpbMTAxLDE2LDIyMSwyMzMsMTE3LDE5OCwxNjIsMTAyLDU2LDg4LDYxLDgyLDE4MywxNSwxMTYsOTIsMTkzLDIyNyw3NCwyNTIsMzEsMTQ3LDgsMjQwLDg0LDIyMSwxMzcsMzMsMTE4LDk2LDg0LDExNF19fQ==');
          });

          it('has signature set to a signature of the encrypted message', () => {
            const body = JSON.parse(options.body);
            expect(body.signature).toBe('INCD2EybEALPlwPwcaSfanGrnZGAyC9pj1LCrD0kqSuqFIcrKYwz98/dAbIjnvsCdvWzFOUw1W9tsC/Ew16EqhA=');
          });
        });
      });
    });

    describe('when the response is missing an id', () => {
      it('rejects the returned promise with an error', () => {
        global.fetch.mockImplementationOnce(() => Promise.resolve({
          ok: true,
          json: () => Promise.resolve({})
        }));

        expect.hasAssertions();

        return sendMessage(message, contact, credentials).catch((error) => {
          expect(error).toBeTruthy();
          expect(error.message).toContain('Unknown error');
        });
      });
    });

    describe('when the response is an error', () => {
      it('rejects the returned promise with the error message from the response', () => {
        global.fetch.mockImplementationOnce(() => Promise.resolve({
          ok: false,
          json: () => Promise.resolve({
            message: '926f0390-1d53-4bb9-a60a-4689f8f2607f'
          })
        }));

        expect.hasAssertions();

        return sendMessage(message, contact, credentials).catch((error) => {
          expect(error).toBeTruthy();
          expect(error.message).toBe('926f0390-1d53-4bb9-a60a-4689f8f2607f');
        });
      });
    });
  });
});
