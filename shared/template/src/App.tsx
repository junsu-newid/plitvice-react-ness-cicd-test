import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { ComboBox, SideNavBar } from '@plitvice/ui';
import '@plitvice/ui/styles/global.css';
import { TextArea } from '@plitvice/ui/components/textfield/TextArea.tsx';

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

            <TextArea
                width={400}
                height={200}
                disabled={true}
                value={
                    '1.1 Eligibility. You must be at least thirteen (13) years of age or older (the “Minimum Age”) to use our Services. If you are under the Minimum Age, you may use our Services if and only if you have the permission to use our Services from your parent or legal guardian, your use of our Services is subject to your parent or legal guardian’s supervision and control, and your parent or legal guardian reads these Terms of Use with you. Certain areas of our Services require you to be a certain age to access. When you use or attempt to use such areas of our Services, you certify that you are at least the required age and satisfy all other eligibility requirements of such Services and agree to all of the terms and conditions described in these Terms of Use. If you are not yet the required age for such areas, you do not satisfy any of other eligibility requirements, or you do not agree with all of the terms and conditions in these Terms of Use for any reason, please discontinue using the areas and/or Services (as applicable) immediately. If you are a parent or legal guardian of a child under the Minimum Age, you are subject to these Terms of Use when you allow your child to use our Services. You are also responsible for your child’s activity on our Services. You acknowledge that you may be exposed to certain content that you may find objectionable while using our Services, and you are responsible for determining whether the content on our Services is suitable for you or, if applicable, any child using our Services under your supervision and control. Some content on our Services may not be suitable for individuals under the Minimum Age. 1.2 Compatibility. By using our Services, you agree that we do not take responsibility or otherwise warrant the performance of your device for our Services, including the continued compatibility with our Service.'
                }
                placeholder={'Placeholder'}
            />

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
