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

import React from "react";
import createReactClass from "create-react-class";
import { PropTypes } from "uu5g05";
import Context from "./context.js";

const LazyContext = Context.create({ loading: "" });

export const Suspense =
  React.Suspense ||
  ((props) => {
    return (
      // eslint-disable-next-line react/prop-types
      <LazyContext.Provider value={{ loading: props.fallback }}>{props.children}</LazyContext.Provider>
    );
  });

const LazyComponent = createReactClass({
  mixins: [],
  statics: {
    getDerivedStateFromError(error) {
      return { error };
    },
    opt: {
      hoc: true,
    },
  },
  propTypes: {
    importFn: PropTypes.func.isRequired,
    loading: PropTypes.node,
    fallback: PropTypes.node,
    props: PropTypes.object,
  },
  getDefaultProps() {
    return {
      importFn: null,
      loading: null,
      fallback: null,
      props: null,
    };
  },
  getInitialState() {
    return { error: null, component: null };
  },
  componentDidMount() {
    this.props.importFn().then(({ result, error }) => {
      !this._isUnmounted && this.setState({ component: result && result.default, error });
    });
  },
  componentWillUnmount() {
    this._isUnmounted = true;
  },
  render() {
    return this.state.component ? (
      <this.state.component {...this.props.props} />
    ) : (
      this.props.loading || this.props.fallback
    );
  },
});

export const lazy =
  React.lazy ||
  ((importFn) => {
    let importFnPromise;
    let usedImportFn = () => {
      // call importFn at most once
      if (!importFnPromise) {
        importFnPromise = importFn().then(
          (result) => ({ result, error: null }),
          (error) => {
            console.error(error);
            return { result: null, error };
          }
        );
      }
      return importFnPromise;
    };
    return (props) => {
      return (
        <LazyContext.Consumer>
          {({ loading }) => <LazyComponent loading={loading} importFn={usedImportFn} props={props} />}
        </LazyContext.Consumer>
      );
    };
  });

export default { Suspense, lazy };
