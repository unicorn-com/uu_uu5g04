import UU5 from "uu5g04";
import UU5 from "uu5g04";

const { shallow } = UU5.Test.Tools;

describe(`UU5.Bricks.ModalBus`, () => {
  it(`default props`, () => {
    const wrapper = shallow(<UU5.Bricks.ModalBus />);
    expect(wrapper).toMatchSnapshot();
  });
});
