import UU5 from "uu5g04";

export const ListContext = UU5.Common.Context.create();

export class Context {
  static withListContext(Component) {
    // disable context for jest tests - enzyme doesn't support React 16.3 Context API
    if (!UU5.Common.Context.create || process.env.NODE_ENV === "test") return Component;
    let forwardRef = UU5.Common.Reference.forward((props, ref) => {
      return (
        <ListContext.Consumer>
          {({ ordered, markerIcon, type, iconColorSchema, counterId, listLevel }) => {
            if (props.markerIcon) {
              markerIcon = props.markerIcon;
            }

            listLevel = (listLevel || 1) + 1;

            if (props.type) {
              type = props.type;

              if (props.type === "1.1") {
                counterId = "counter_id_" + UU5.Common.Tools.generateUUID();
                listLevel = 1;
              }
            }

            if (props.iconColorSchema) {
              iconColorSchema = props.iconColorSchema;
            }

            return (
              <Component
                {...props}
                ref={ref}
                ordered={ordered}
                markerIcon={markerIcon}
                type={type}
                iconColorSchema={iconColorSchema}
                counterId={counterId}
                listLevel={listLevel}
              />
            );
          }}
        </ListContext.Consumer>
      );
    });

    forwardRef.isUu5PureComponent = true;
    forwardRef.displayName = `forwardRef(${Component.displayName || Component.name || "Component"})`;
    forwardRef.tagName = Component.tagName;

    return forwardRef;
  }

  static withListItemContext(Component) {
    // disable context for jest tests - enzyme doesn't support React 16.3 Context API
    if (!UU5.Common.Context.create || process.env.NODE_ENV === "test") return Component;
    let forwardRef = UU5.Common.Reference.forward((props, ref) => {
      return (
        <ListContext.Consumer>
          {({ ordered, markerIcon, type, iconColorSchema, counterId, listLevel }) => {
            if (props.markerIcon) {
              markerIcon = props.markerIcon;
            }

            if (props.iconColorSchema) {
              iconColorSchema = props.iconColorSchema;
            }

            return (
              <Component
                {...props}
                ref={ref}
                ordered={ordered}
                markerIcon={markerIcon}
                type={type}
                iconColorSchema={iconColorSchema}
                counterId={counterId}
                listLevel={listLevel}
              />
            );
          }}
        </ListContext.Consumer>
      );
    });

    forwardRef.isUu5PureComponent = true;
    forwardRef.displayName = `forwardRef(${Component.displayName || Component.name || "Component"})`;
    forwardRef.tagName = Component.tagName;

    return forwardRef;
  }
}

export default Context;
