const {
  validarNombre,
  validarEmail,
  validarTelefono,
  validarCheckOut,
  validarMetodoPago,
  crearReserva,
  leerReservas,
  guardarReserva,
  validarCredenciales,
  eliminarReserva,
} = require("../src/core/reservas");

function crearStorageFalso() {
  const datos = {};
  return {
    getItem: function (clave) {
      return Object.prototype.hasOwnProperty.call(datos, clave) ? datos[clave] : null;
    },
    setItem: function (clave, valor) {
      datos[clave] = valor;
    },
  };
}

describe("validarNombre", function () {
  test("rechaza el nombre vacío", function () {
    expect(validarNombre("")).toBeTruthy();
  });

  test("acepta un nombre válido", function () {
    expect(validarNombre("Camilo Pardo")).toBeFalsy();
  });
});

describe("validarEmail", function () {
  test("rechaza un mail sin arroba", function () {
    expect(validarEmail("camilo.test.com")).toBeTruthy();
  });

  test("acepta un mail con formato válido", function () {
    expect(validarEmail("camilo@test.com")).toBeFalsy();
  });
});

describe("validarTelefono", function () {
  test("rechaza un teléfono de menos de 8 dígitos", function () {
    expect(validarTelefono("1234567")).toBeTruthy();
  });

  test("acepta un teléfono de 9 dígitos", function () {
    expect(validarTelefono("099123456")).toBeFalsy();
  });
});

describe("validarCheckOut", function () {
  test("rechaza un check-out anterior o igual al check-in", function () {
    expect(validarCheckOut("2026-08-01", "2026-08-05")).toBeTruthy();
  });

  test("acepta un check-out posterior al check-in", function () {
    expect(validarCheckOut("2026-08-10", "2026-08-05")).toBeFalsy();
  });
});

describe("validarMetodoPago", function () {
  test("rechaza un método de pago no soportado", function () {
    expect(validarMetodoPago("criptomonedas")).toBeTruthy();
  });

  test("acepta tarjeta, transferencia y efectivo", function () {
    expect(validarMetodoPago("tarjeta")).toBeFalsy();
  });
});

describe("validarCredenciales", function () {
  test("acepta la credencial correcta", function () {
    expect(validarCredenciales("carolina", "hotel")).toBe(true);
  });

  test("el usuario no distingue mayúsculas de minúsculas", function () {
    expect(validarCredenciales("CAROLINA", "hotel")).toBe(true);
  });

  test("la contraseña sí distingue mayúsculas de minúsculas", function () {
    expect(validarCredenciales("carolina", "HOTEL")).toBe(false);
  });
});

describe("crearReserva y guardarReserva", function () {
  test("crearReserva arma la reserva con los datos del formulario", function () {
    const valores = {
      nombre: "  Camilo Pardo  ",
      habitacion: "doble",
      metodoPago: "tarjeta",
    };
    const reserva = crearReserva(valores, function () {
      return "ID-FIJO";
    });
    expect(reserva.nombre).toBe("Camilo Pardo");
    expect(reserva.habitacionNombre).toBe("Doble");
  });

  test("guardarReserva persiste y conserva las reservas anteriores", function () {
    const storage = crearStorageFalso();
    guardarReserva({ id: "1", nombre: "Camilo" }, storage);
    guardarReserva({ id: "2", nombre: "Ana" }, storage);
    expect(leerReservas(storage).length).toBe(2);
  });
});

describe("eliminarReserva", function () {
  test("elimina solo la reserva con el id indicado", function () {
    const storage = crearStorageFalso();
    guardarReserva({ id: "1", nombre: "Camilo" }, storage);
    guardarReserva({ id: "2", nombre: "Ana" }, storage);
    const restantes = eliminarReserva("1", storage);
    expect(restantes.length).toBe(1);
    expect(restantes[0].id).toBe("2");
  });
});
