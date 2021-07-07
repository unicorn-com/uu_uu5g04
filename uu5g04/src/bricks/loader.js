/**
 * Copyright (C) 2021 Unicorn a.s.
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public
 * License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later
 * version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License at
 * <https://gnu.org/licenses/> for more details.
 *
 * You may obtain additional information at <https://unicorn.com> or contact Unicorn a.s. at address: V Kapslovne 2767/2,
 * Praha 3, Czech Republic or at the email: info@unicorn.com.
 */

//@@viewOn:imports
import * as UU5 from "uu5g04";
//@@viewOff:imports

export const Loader = UU5.Common.Loader;

Loader.createContext = () => {
  let LoaderContext = UU5.Common.Context.create();

  const Provider = (props) => (
    <Loader {...props}>
      {(values) => <LoaderContext.Provider value={values}>{props.children}</LoaderContext.Provider>}
    </Loader>
  );

  const Consumer = (props) => <LoaderContext.Consumer>{props.children}</LoaderContext.Consumer>;

  return { Provider, Consumer };
};

export default Loader;
