import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { CommonButton, SearchIcon, theme } from '@plitvice/ui';
import { TextField } from '@plitvice/ui';

function App() {
    const { t } = useTranslation();

    return (
        <Container>
            <NewidTitle>NEWID</NewidTitle>
            <CommonButton size="lg" variant="stroke">
                {t('common.welcome')}
            </CommonButton>

            <TextField size="lg">
                <TextField.InputBox>
                    <TextField.Label>Label</TextField.Label>
                    <TextField.Input placeholder="Placeholder" />
                </TextField.InputBox>
                <TextField.Icon>
                    <SearchIcon style={{ color: theme.colors.grey50 }} />
                </TextField.Icon>
            </TextField>
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
    background: -webkit-linear-gradient(left, rgb(0, 111, 185), rgb(111, 44, 135), rgb(221, 37, 20));
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
