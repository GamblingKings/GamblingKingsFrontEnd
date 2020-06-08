/* eslint-disable operator-linebreak */
/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import withMainBackGround from '../modules/common/components/withMainBackground';

const Title = (): JSX.Element => {
  const tStyle = {
    flex: 1,
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
    padding: '10px',
  } as React.CSSProperties;
  return (
    <div style={vLStyle}>
      <SingleRowDiv />
      <SingleRowDiv />
      <SingleRowDiv />
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
      <PersonCard />
    </div>
  );
};

const PersonCard = (): JSX.Element => {
  const pCStyle = {
    height: '200px',
    display: 'flex',
    margin: '10px',
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
    margin: '15px 25px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    height: '150px',
    display: 'inline-block',
  } as React.CSSProperties;
  // const possibleLines: number = 8;
  const description =
    'Lorem Ipsum is simply dummy text of the printing andLorem Ipsum is simply dummy text of the printing andLorem Lorem Ipsum is simply dummy text of the printing andLorem Ipsum is simply dummy text of the printing andLoreLorem Ipsum is simply dummy text of the printing andLorem Ipsum is simply dummy text of the printing andLorem Lorem Ipsum is simply dummy text of the printing andLorem Ipsum is simply dummy text of the printing andLoreLorem Ipsum is simply dummy text of the printing andLorem Ipsum is simply dummy text of the printing andLorem Lorem Ipsum is simply dummy text of the printing andLorem Ipsum is simply dummy text of the printing andLoreLorem Ipsum is simply dummy text of the printing andLorem Ipsum is simply dummy text of the printing andLorem Lorem Ipsum is simply dummy text of the printing andLorem Ipsum is simply dummy text of the printing andLoreLorem Ipsum is simply dummy text of the printing andLorem Ipsum is simply dummy text of the printing andLorem Lorem Ipsum is simply dummy text of the printing andLorem Ipsum is simply dummy text of the printing andLoreLorem Ipsum is simply dummy text of the printing andLorem Ipsum is simply dummy text of the printing andLorem Lorem Ipsum is simply dummy text of the printing andLorem Ipsum is simply dummy text of the printing andLore';
  // if (description.length > )
  return (
    <div style={pDStyle}>
      <p>{description}</p>
    </div>
  );
};

const ObservableView = (): JSX.Element => {
  const innerDivStyle = {
    backgroundColor: 'white',

    alignItems: 'stretch',
    textAlign: 'center',
    borderRadius: '5px',
    padding: '5px',
    display: 'flex',
    flexDirection: 'column',

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
