// Додаткове завдання - необов'язкове
// 1. Написати unit-тести для контролера входу (логін)
// За допомогою Jest
// •	відповідь повина мати статус-код 200
// •	у відповіді повинен повертатися токен
// •	у відповіді повинен повертатися об'єкт user з 2 полями email и subscription з типом даних String

const { login } = require("./users.controllers");
const { loginServices } = require("../services/users.services");

jest.mock("../services/users.services");

let mockRes;
let userObject;

describe("Контролер входу", () => {
  beforeAll(async () => {
    // Підготовка
    const mockCurrentUser = {
      email: "test@example.com",
      subscription: "free",
    };

    const mockToken = "mockedToken";

    // Мокуємо функцію з сервісу для входу
    loginServices.mockResolvedValue({
      currentUser: mockCurrentUser,
      token: mockToken,
    });

    // Створюємо мок для res
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Дія - Викликаємо контролер
    await login({ body: {} }, mockRes, jest.fn());

    // Перевірка - Перевіряємо відповідь
    const responseBody = mockRes.json.mock.calls[0][0];
    userObject = responseBody;
  });

  test("повинен повернути статус-код 200", () => {
    expect(mockRes.status).toHaveBeenCalledWith(200);
  });

  test("повинен повертати властивість 'token'", () => {
    // console.log("userObject:", userObject);
    expect(userObject).toHaveProperty("token");
  });

  test("повинен повертати об'єкт користувача з властивостями email та subscription типу string", () => {
    expect(userObject.user).toHaveProperty("email");
    expect(userObject.user).toHaveProperty("subscription");
    expect(typeof userObject.user.email).toBe("string");
    expect(typeof userObject.user.subscription).toBe("string");
  });
});
