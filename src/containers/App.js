import React, {Component} from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from '../components/Navigation/Navigation';
import FaceRecognition from '../components/FaceRecognition/FaceRecognition';
import Logo from '../components/Logo/Logo';
import ImageLinkForm from '../components/ImageLinkForm/ImageLinkForm';
import Rank from '../components/Rank/Rank';
import './App.css';

const app = new Clarifai.App({
  apiKey: '48edb7bf44a742768532725b389f43e2' 
});

const particlesOptions = {
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
};

class App extends Component {

  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {}
    }
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height= Number(image.height);
   // console.log ("height: " + height);
   // console.log(`Height is: ${height}; Width is ${width}, clarifaiFace is: ${clarifaiFace}`);
    //   const tleftCol= clarifaiFace.left_col * width
    //   const ttopRow = clarifaiFace.top_row * height
    //   const trightCol= width - (clarifaiFace.right_col * width)
    //   const tbottomRow = height - (clarifaiFace.bottom_row * height)
    // console.log(tleftCol + ' , ' + ttopRow + ' , ' + trightCol + ' , ' + tbottomRow);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height),
    }
  }

  displayFacesInBox = (box) => {
    this.setState({box: box});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
      app.models
        .predict(Clarifai.FACE_DETECT_MODEL, 
        this.state.input)
      .then(response => this.displayFacesInBox(this.calculateFaceLocation(response)))
      .catch(err => console.log(err));
    }

   render(){
     return(
      <div className="App">
        <Particles className='particles'
          params={particlesOptions}
        />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm 
          onInputChange = {this.onInputChange} 
          onButtonSubmit = {this.onButtonSubmit}
        />
        <FaceRecognition 
          imageUrl = {this.state.imageUrl}
          box = {this.state.box}

        /> 
      </div>
     );
   
   }
}

export default App;
