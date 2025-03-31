import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { ComboBox, SideNavBar } from '@plitvice/ui';
import '@plitvice/ui/styles/global.css';

const optionList = [
    { value: 'item01', label: 'Item01' },
    { value: 'item02', label: 'Item02' },
    { value: 'item03', label: 'Item03' },
];

function App() {
    const { t } = useTranslation();

    return (
        <Container>
            <NewidTitle>{t('common.appName')}</NewidTitle>

            <ComboBox
                size={'large'}
                width={400}
                label={'label'}
                readonly={true}
                labelPosition={'outer'}
                disabled={false}
            >
                <ComboBox.List optionList={optionList} />
            </ComboBox>

            <SideNavBar width={400} defaultSelected={'drop 1'}>
                <SideNavBar.Item id={'menu 1'} label={'menu 1'} />
                <SideNavBar.Item id={'menu 2'} label={'menu 2'}>
                    <SideNavBar.DropdownItem id={'drop 1'} label={'drop 1'} />
                    <SideNavBar.DropdownItem id={'drop 2'} label={'drop 2'} />
                    <SideNavBar.DropdownItem id={'drop 3'} label={'drop 3'} />
                </SideNavBar.Item>
                <SideNavBar.Item id={'menu 3'} label={'menu 3'} />
                <SideNavBar.Item id={'menu 4'} label={'menu 4'} />
            </SideNavBar>
        </Container>
    );
}

export default App;

const Container = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    max-width: 1200px;
    margin: 0 auto;
    height: 100dvh;
    gap: 12px;
`;

const NewidTitle = styled.h1`
    font-size: 10rem;
    background: linear-gradient(to right, rgb(0, 111, 185), rgb(111, 44, 135), rgb(221, 37, 20));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    text-align: center;
    box-sizing: border-box;
    overflow-wrap: break-word;
    width: 100%;
    line-height: 1.2;
    white-space: nowrap;
`;
