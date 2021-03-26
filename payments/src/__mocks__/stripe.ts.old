// only executed when running our code in test env

export const stripe = {
  charges: {
    // mockResolvedValue makes sure that whenever we call the create function we will
    // get back a promise that automatically resolve with empty object
    // We are doing it because we are awaiting back in new.ts file
    create: jest.fn().mockResolvedValue({})
  }
}
