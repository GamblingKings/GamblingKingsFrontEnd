/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable operator-linebreak */
/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import { Text } from 'react-native';
import withMainBackGround from '../components/common/withMainBackground';

const Title = (): JSX.Element => {
  const tStyle = {
    flex: 1,
    textAlign: 'center',

    // backgroundColor: 'teal',
  } as React.CSSProperties;
  return (
    <div style={tStyle}>
      <strong>
        <h1>Meet the team</h1>
      </strong>
    </div>
  );
};

const VerticalList = (): JSX.Element => {
  const vLStyle = {
    // backgroundColor: 'green',
    flexDirection: 'column',
  } as React.CSSProperties;
  return (
    <div style={vLStyle}>
      <SingleRowDiv />
      {/* <SingleRowDiv />
      <SingleRowDiv /> */}
    </div>
  );
};

const SingleRowDiv = (): JSX.Element => {
  const sRDStyle = {
    // backgroundColor: 'grey',
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'space-evenly',
  } as React.CSSProperties;
  return (
    <div style={sRDStyle}>
      <PersonCard />
      {/* <PersonCard /> */}
    </div>
  );
};

const PersonCard = (): JSX.Element => {
  const pCStyle = {
    height: '200px',
    width: '50%',
    display: 'flex',
    margin: '0.5%',
    flexFlow: 'row nowrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
  } as React.CSSProperties;
  return (
    <div style={pCStyle}>
      <ProfilePicture />
      <ProfileDescription />
    </div>
  );
};

const ProfilePicture = (): JSX.Element => {
  const pPStyle = {
    width: '160px',
    height: '160px',
    order: 1,
  } as React.CSSProperties;
  const dogLink =
    'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?cs=srgb&dl=two-yellow-labrador-retriever-puppies-1108099.jpg&fm=jpg';
  return <img src={dogLink} style={pPStyle} />;
};

const ProfileDescription = (): JSX.Element => {
  const pDStyle = {
    order: 2,
    margin: '1px 2px',
    padding: '1% 1%',
    height: '100%',
    display: 'flex',
    flexFlow: 'column nowrap',
    textAlign: 'left',
    flexGrow: 2,
  } as React.CSSProperties;
  const description =
    'Lorem Ipsum is simply dummy text my text of the printing andLorem Lorem Ipsum is simply dummy text of the printing andLorem Ipsum is simply dummy text of the printing andLoreLorem Ipsum is simply dummy text my text of the printing andLorem Lorem Ipsum is simply dummy text of the printing andLorem Ipsum is simply dummy text of the printing andLore';
  // const desp2 = 'helloworld';
  return (
    <div style={pDStyle}>
      <Name />
      {/* <Description description={desp2} /> */}

      <Description description={description} />
    </div>
  );
};

const Name = (): JSX.Element => {
  const nStyle = {
    fontSize: '30px',
    order: 1,
    // flexFlow: 'row nowrap',
  } as React.CSSProperties;
  const name = 'Tom Riddle';
  return <div style={nStyle}>{name}</div>;
};

const Description = (props: DescriptionProps): JSX.Element => {
  const dStyle = {
    fontSize: '10px',
    order: 2,
    flex: 1,
    // overflow: 'hidden',
    // whiteSpace: 'nowrap',
    // textOverflow: 'ellipsis',
  } as React.CSSProperties;
  // console.log(divDimensions);

  const { description } = props;
  return <Text style={dStyle}>{description}</Text>;
};

const ObservableView = (): JSX.Element => {
  const innerDivStyle = {
    backgroundColor: 'white',

    // alignItems: 'stretch',
    borderRadius: '2.5%',
    padding: '0.1%',
    display: 'flex',
    flexFlow: 'column nowrap',

    margin: '5px 10px',
  } as React.CSSProperties;
  return (
    <div style={innerDivStyle}>
      <Title />
      <VerticalList />
    </div>
  );
};

const AboutPage = (): React.ReactElement<unknown, string> | null => withMainBackGround(ObservableView)(1);

export default AboutPage;

export interface DescriptionProps {
  description?: string;
}
