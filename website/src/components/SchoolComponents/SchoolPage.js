import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Header from "../Header.js";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import "../../styles/School.css";
import axios from "axios";
import Button from "@material-ui/core/Button";
import ReactMapGL, { Marker } from "react-map-gl";
import Icon from "@material-ui/core/Icon";
import GLOBALS from "../../config/common";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { Link, NavLink} from 'react-router-dom';
import { Redirect } from 'react-router';


class SchoolPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      info: {},
      marginTop: 0,
      viewport: {},
      open: false
    };
    this.renderPrograms = this.renderPrograms.bind(this);
  }

  submitApplication(id) {
    axios
      .post(
        GLOBALS.API_ROOT + "/api/applications/programs/create/",
        {
          program: id
        },
        {
          headers: { Authorization: "Token " + localStorage.getItem("token") }
        }
      )
      .then(response => {
        console.log(response.data);
        this.setState({ open: true });
      })
      .catch(error => {
        console.log(error.response.data);
      });
  }

  renderPrograms() {
    return this.state.info.programs.map(program => {
      return (
        <ExpansionPanel key={program.uid}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <h2 className="program-title">
              {program.name}
              <span className="program-price">${program.tuition}</span>
            </h2>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Grid direction="column" container>
              <p
                className="program-description"
                dangerouslySetInnerHTML={{ __html: program.description }}
              />
              {program.average_applicant_grade ?
                <p><b>Average Grade: </b> {program.average_applicant_grade.toFixed(2)} %</p> : <div></div>
              }
              <p><b>Application Fee: </b> ${program.application_fee} (CAD) </p>
              <div style={{ alignSelf: "flex-end" }}>
              <Button
                variant="contained"
                color="primary"
                style={{ backgroundColor: "#4384AB", marginRight: "10px"}}
                component={Link} to={"/programs/"+program.uid}
              >
                Details
              </Button>
              {
                localStorage.getItem("token") ? 
              <Button
                variant="contained"
                color="primary"
                style={{ backgroundColor: "#4384AB", float: "right" }}
                onClick={e => this.submitApplication(program.uid, e)}
              >
                Apply
              </Button> :
              <Button 
              variant="contained"
              color="primary"
              style={{backgroundColor: "#4384AB", float: "right" }}>
                <Link to="/login">
                  Apply
                </Link>
              </Button>
              }
              </div>
            </Grid>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      );
    });
  }
  componentDidMount() {
    const { match } = this.props;
    const id = match.params.uid;
    axios
      .get(
        GLOBALS.API_ROOT +
          "/api/institutions/"+id
      )
      .then(response => {
        console.log(response.data);
        this.setState({
          info: response.data
        });
        this.setState({
          viewport: {
            width: "100%",
            height: 400,
            latitude: response.data.latitude,
            longitude: response.data.longitude,
            zoom: 12
          }
        });
      })
      .catch(error => {
        console.log(error.response.data);
      });
  }

  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ open: false });
  };

  render() {
    return (
      <div>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
        <Header />
        <div className="body-wrapper">
          <Grid
            container
            spacing={24}
            direction="row"
            justify="center"
            alignItems="flex-start"
          >
            <SideBar info={this.state.info} />
            <Grid item xs={12} md={9} className="school-desc">
              <Card>
                <CardContent>
                  <h1>About</h1>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: this.state.info.description
                    }}
                  />

                  <h2>Location</h2>
                  {!this.state.info.name ? (
                    <p>Loading.. </p>
                  ) : (
                    <ReactMapGL
                      mapStyle="mapbox://styles/iceandele/cjtytiw8800st1fl2215j3pku"
                      mapboxApiAccessToken={
                        "pk.eyJ1IjoiaWNlYW5kZWxlIiwiYSI6ImNqb2F1dXFoazF3Ynozdm5sZDBtcW1xbnQifQ.MvnPlcX-tgVTqx-Vd-is-w"
                      }
                      {...this.state.viewport}
                      onViewportChange={viewport => this.setState({ viewport })}
                    >
                      <Marker
                        latitude={this.state.info.latitude}
                        longitude={this.state.info.longitude}
                        offsetLeft={-20}
                        offsetTop={-10}
                      >
                        <Icon
                          className="material-icons"
                          color="primary"
                          style={{ color: "#4384AB" }}
                        >
                          school
                        </Icon>
                      </Marker>
                    </ReactMapGL>
                  )}
                  <h2>Programs</h2>

                  {!this.state.info.programs ? (
                    <p>Loading.. </p>
                  ) : (
                    this.renderPrograms()
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center"
            }}
            open={this.state.open}
            onClose={this.handleClose}
            message={
              <span id="message-id">Application Submitted Successfully</span>
            }
            action={[
              <IconButton
                key="close"
                aria-label="Close"
                color="inherit"
                onClick={this.handleClose}
              >
                <CloseIcon />
              </IconButton>
            ]}
          />
        </div>
      </div>
    );
  }
}

class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      marginTop: 0
    };
    this.handleScroll = this.handleScroll.bind(this);
  }
  handleScroll() {
    let scrollTop = window.scrollY;
    this.setState({
      marginTop: scrollTop + "px"
    });
  }
  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }
  render() {
    return (
      <Grid
        item
        xs={9}
        md={3}
        className="school-info"
        style={{ marginTop: this.state.marginTop }}
      >
        <Card>
          <CardContent>
            {this.props.info.name ? (
              <div>
                <img src={this.props.info.logo} alt="profilepic" />
                <h3>
                  <img
                    alt={this.props.info.country}
                    src={`https://www.countryflags.io/${
                      this.props.info.country
                    }/flat/24.png`}
                  />{" "}
                  {this.props.info.name}
                </h3>
                <p>Founded in {this.props.info.founded}</p>
                <p>
                  {[
                    this.props.info.street,
                    this.props.info.city,
                    this.props.info.province
                  ].join(", ")}
                </p>
                {this.props.info.dli_number ? (
                  <p>
                    <strong>DLI Number</strong>: {this.props.info.dli_number}
                  </p>
                ) : (
                  ""
                )}
                {this.props.info.cost_of_living ? (
                  <p>
                    <strong>Cost of Living</strong>:{" "}
                    {this.props.info.cost_of_living}
                  </p>
                ) : (
                  ""
                )}
                {this.props.info.scores_overall_rank ? (
                  <p>
                    <strong>Ranking (Overall)</strong>:{" "}
                    {this.props.info.scores_overall_rank}
                  </p>
                ) : (
                  ""
                )}
                {this.props.info.scores_teaching_rank ? (
                  <p>
                    <strong>Ranking (Teaching)</strong>:{" "}
                    {this.props.info.scores_teaching_rank}
                  </p>
                ) : (
                  ""
                )}
                {this.props.info.scores_research_rank ? (
                  <p>
                    <strong>Ranking (Research)</strong>:{" "}
                    {this.props.info.scores_research_rank}
                  </p>
                ) : (
                  ""
                )}
                {this.props.info.scores_citations_rank ? (
                  <p>
                    <strong>Ranking (Citations)</strong>:{" "}
                    {this.props.info.scores_citations_rank}
                  </p>
                ) : (
                  ""
                )}
                {this.props.info.scores_industry_income_rank ? (
                  <p>
                    <strong>Ranking (Industry)</strong>:{" "}
                    {this.props.info.scores_industry_income_rank}
                  </p>
                ) : (
                  ""
                )}
                {this.props.info.scores_international_outlook_rank ? (
                  <p>
                    <strong>Ranking (International Outlook)</strong>:{" "}
                    {this.props.info.scores_international_outlook_rank}
                  </p>
                ) : (
                  ""
                )}
                {this.props.info.stats_number_students ? (
                  <p>
                    <strong>Number of Students</strong>:{" "}
                    {this.props.info.stats_number_students}
                  </p>
                ) : (
                  ""
                )}
                {this.props.info.stats_student_staff_ratio ? (
                  <p>
                    <strong>Student Staff Ratio</strong>:{" "}
                    {this.props.info.stats_student_staff_ratio}
                  </p>
                ) : (
                  ""
                )}
                {this.props.info.stats_pc_intl_students ? (
                  <p>
                    <strong>% International Students</strong>:{" "}
                    {this.props.info.stats_pc_intl_students}
                  </p>
                ) : (
                  ""
                )}
                {this.props.info.stats_female_male_ratio ? (
                  <p>
                    <strong>Female to Male Ratio</strong>:{" "}
                    {this.props.info.stats_female_male_ratio}
                  </p>
                ) : (
                  ""
                )}
              </div>
            ) : (
              ""
            )}
          </CardContent>
        </Card>
      </Grid>
    );
  }
}

export default withRouter(SchoolPage);
