import React from 'react';
import {shallow, mount} from 'enzyme';

import { ValueEditor } from '../../lib/controls/index';

describe('<ValueEditor />', ()=> {

    it('should exist', ()=> {
        expect(ValueEditor).to.exist;
    });

    describe('when using default rendering', ()=> {
        it('should have an <input /> element', ()=> {
            const dom = shallow(<ValueEditor />);
            expect(dom.find('input')).to.have.length(1);
        });

        it('should render nothing for operator "null"', ()=> {
            const dom = shallow(<ValueEditor operator="null" />);
            expect(dom.type()).to.be.null;
        });

        it('should render nothing for operator "notNull"', ()=> {
            const dom = shallow(<ValueEditor operator="notNull" />);
            expect(dom.type()).to.be.null;
        });

        it('should call the onChange method passed in', ()=> {
            let count = 0;
            const mockEvent = {target:{value:"foo"}};
            const onChange = ()=>count++;
            const dom = shallow(<ValueEditor handleOnChange={onChange} />);

            dom.find('input').simulate('change', mockEvent);
            expect(count).to.equal(1);
        });
    });

    describe('when a custom component is used', ()=> {
        class MyComponent extends React.Component {
            render() {
                return(<div />);
            }
        };

        it('should render the custom component', ()=> {
            const dom = mount(<ValueEditor><MyComponent /></ValueEditor>);
            expect(dom.find('input')).to.have.length(0);
            expect(dom.find('div')).to.have.length(1);
        });
    });
});
