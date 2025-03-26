import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { SearchField, SideNavBar } from '@plitvice/ui';

function App() {
    const { t } = useTranslation();

    return (
        <Container>
            <NewidTitle>{t('common.appName')}</NewidTitle>

            <SearchField width={240} />

            <Side>
                <SideNavBar defaultSelected={'drop 1'}>
                    <SideNavBar.Item id={'menu 1'} label={'menu 1'} />
                    <SideNavBar.Item id={'menu 2'} label={'menu 2'}>
                        <SideNavBar.DropdownItem id={'drop 1'} label={'drop 1'} />
                        <SideNavBar.DropdownItem id={'drop 2'} label={'drop 2'} />
                        <SideNavBar.DropdownItem id={'drop 3'} label={'drop 3'} />
                    </SideNavBar.Item>
                    <SideNavBar.Item id={'menu 3'} label={'menu 3'} />
                    <SideNavBar.Item id={'menu 4'} label={'menu 4'} />
                </SideNavBar>
            </Side>
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

const Side = styled.div`
    position: absolute;
    top: 0;
    left: 0;
`;
