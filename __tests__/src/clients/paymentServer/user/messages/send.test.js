import sendMessage from '../../../../../../src/clients/paymentServer/user/messages/send';

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
      it('is made to the url https://pine-payment-server.pine.pm/v1/users/8YZpTYqxzY4XvNUBx1o4skSCz9rTJquyD/messages', () => {
        const expectedUrl = 'https://pine-payment-server.pine.pm/v1/users/8YZpTYqxzY4XvNUBx1o4skSCz9rTJquyD/messages';
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
          expect(options.headers['Authorization']).toBe('Basic ZnJvbUBwaW5lLnBtOklPRUFPK3RRSW9FOXRHRlZlMUdyOTVWZzYwKzNkWEhtQ1drVEd5cnBBUVh4UzE4Q0QyNzFOaXFaRjF0dGJzK2VKNkUwak1DZzhZV2xxYXA3VTBMY2tSWT0=');
        });

        describe('the body', () => {
          it('is a JSON string', () => {
            const body = JSON.parse(options.body);
            expect(typeof body).toBe('object');
          });

          it('has encryptedMessage set to the encrypted message', () => {
            const body = JSON.parse(options.body);
            expect(body.encryptedMessage).toBe('eyJpdiI6IjAxMjM0NTY3ODlhYmNkZWYwMTIzNDU2Nzg5YWJjZGVmIiwiZXBoZW1QdWJsaWNLZXkiOiIwNDQ2NDZhZTUwNDczMTZiNDIzMGQwMDg2YzhhY2VjNjg3ZjAwYjFjZDlkMWRjNjM0ZjZjYjM1OGFjMGE5YThmZmZmZTc3YjRkZDBhNGJmYjk1ODUxZjNiNzM1NWM3ODFkZDYwZjg0MThmYzhhNjVkMTQ5MDdhZmY0N2M5MDNhNTU5IiwiY2lwaGVydGV4dCI6ImZhMTJiY2UxYThhYWJjMWFiYzgyNDg1MDJkZjlmOWE3Yjc0MDg4N2NjMjZkZWNlZTAzMDc3ODIzZjdlZDYyOTE5NDkyYzJjZTc0ZGJhMDc2MWJkYjU5NDAyNmZjYzcwZSIsIm1hYyI6IjY1MTBkZGU5NzVjNmEyNjYzODU4M2Q1MmI3MGY3NDVjYzFlMzRhZmMxZjkzMDhmMDU0ZGQ4OTIxNzY2MDU0NzIifQ==');
          });

          it('has signature set to a signature of the encrypted message', () => {
            const body = JSON.parse(options.body);
            expect(body.signature).toBe('IGt0XDrvPbmsMaZ8Gf/3Xw+dNkINms5eA7bV9UhyC4evPkj2P26158W7Pkilu106hQ7ii81ozby0ShpqgvqgKis=');
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
          expect(error.message).toContain('invalid response');
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
