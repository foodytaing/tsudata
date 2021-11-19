import React from "react";
import Input from "../components/form/Input";

import logo from "../img/tsudata-logo.png"

const FormSignIn = [
  {
    label: "Pseudo",
    name: "pseudo"
  },
  {
    label: "Mot de passe",
    name: "password"
  }
];

const FormSignUp = [
  {
    label: "Pseudo",
    name: "pseudo"
  },
  {
    label: "Mot de passe",
    name: "password"
  },
  {
    label: "Confirmer votre Mot de passe",
    name: "confirm-password"
  }
];

const SignIn = () => {

  return (
    <div className="form-sign-in">
      <h1>Sign In</h1>
      <form className="simple-form" autoComplete="off">
        {FormSignIn.map((form, index) => {
          return (
            <Input
              key={index}
              label={form?.label}
              name={form?.name}
              type={form?.type}
              options={form?.options}
              fieldClass={form?.fieldClass}
            />
          )
        })}
      </form>
    </div>
  )
}

const SignUp = () => {
  return (
    <div className="form-sign-up">
      <form className="simple-form" autoComplete="off">

      </form>
    </div>
  )
}

const Profil = () => {
  return (
    <div className="container">
      <header>
        <img src={logo} alt="tsudata" className="logo-tsudata" />
      </header>
      <SignIn />
    </div>
  );
};

export default Profil;