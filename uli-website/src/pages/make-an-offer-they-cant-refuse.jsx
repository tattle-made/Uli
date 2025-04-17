import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextInput,
  Text,
  Heading,
  FormField,
  Form,
  Image,
} from "grommet";

import lose from "../images/you-lose-good-day.gif";
import { StaticImage } from "gatsby-plugin-image";

import AppShell from "../components/molecules/AppShell";

function TextWithLabel({
  label,
  value,
  onChange,
  placeholder = "type here",
  type = "text",
  disabled = false,
  max = undefined,
}) {
  return (
    <FormField label={<Text >{label}</Text>}>
      <TextInput
        required
        placeholder={placeholder}
        type={type}
        min={0}
        max={max}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    </FormField>
  );
}

const DataworksGameCalculator = () => {
  const [days, setDays] = useState(30);
  const [budget, setBudget] = useState(0);
  const [hoursRequired, setHoursRequired] = useState(0);
  const [annotators, setAnnotators] = useState(0);
  const [wagePerAnnotator, setWagePerAnnotator] = useState(130);
  const [hoursPerDay, setHoursPerDay] = useState(0); //hours per day per annotator
  const [results, setResults] = useState(null);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [alert, setAlert] = useState(null);

  const scenarios = [
    {
      text: "We need to mark 1000 hours of voice samples that closely resemble Amitabh Bacchan's voice.",
      days: 30,
      budget: 25000,
      hoursRequired: 1000,
    },
    {
      text: "We need annotations on 10000 top reels to identify happy capybaras",
      note: "An annotator cannot view more than 20 reels an hour. That is the minimum numbers of hours needed for the task is 500 .",
      days: 15,
      budget: 45000,
      hoursRequired: 500,
    },
    {
      text: "You need to annotate sub-genres of 10000 1970s rock songs.",
      note: "You can not listen to more than 25 songs an hour. Which means that the task will take at least 400 hours",
      days: 15,
      budget: 35000,
      hoursRequired: 400,
    },
  ];

  useEffect(() => {
    setResults(null);
  }, [days, budget, hoursRequired, annotators, wagePerAnnotator, hoursPerDay]);

  function calculate(e) {
    // e.preventDefault()
    setResults(null);
    setAlert(null);
    if (
      !budget ||
      !hoursRequired ||
      !annotators ||
      !wagePerAnnotator ||
      !hoursPerDay
    ) {
      setAlert("Please fill all the fields.");
      return;
    }
    let totalDaysRequired =
      Math.ceil(hoursRequired / (hoursPerDay * annotators)) || 0;
    let totalCost = Math.ceil(hoursRequired * wagePerAnnotator);
    let moneyLeft = budget - totalCost;
    let operationStatus =
      moneyLeft >= 0 && totalDaysRequired <= days ? "Feasible" : "Not Feasible";
    setResults({
      totalDaysRequired,
      totalCost,
      moneyLeft,
      operationStatus,
    });
  }

  function clearResults() {
    setResults(null);
    setAlert(null);
  }

  function generateRandomScenario() {
    let randomScenario =
      scenarios[Math.floor(Math.random() * scenarios.length)];
    setSelectedScenario(randomScenario);
    setDays(randomScenario.days);
    setBudget(randomScenario.budget);
    setHoursRequired(randomScenario.hoursRequired);
    setAnnotators(0);
    setWagePerAnnotator(130);
    setHoursPerDay(0);
    setResults(null);
    setAlert(null);
  }

  function clearScenario() {
    setSelectedScenario(null);
    setDays(30);
    setBudget(0);
    setHoursRequired(0);
    setAnnotators(0);
    setWagePerAnnotator(130);
    setHoursPerDay(0);
    setResults(null);
    setAlert(null);
  }
  return (
    <Box
      pad="medium"
      margin={{ top: "small" }}
      border={{ color: "brand", size: "small" }}
      round="small"
    >
      <Heading
        level={3}
        className="mx-auto"
        margin={{ top: "0", bottom: "small" }}
      >
        Data Annotator Wage Calculator
      </Heading>
      <Box>
        <Box className="flex flex-row gap-2 justify-center">
          <Button
            onClick={generateRandomScenario}
            label="Generate Random Scenario"
            
            className="w-52 mt-2 text-sm bg-gray-200 hover:bg-gray-300"
          />
          {selectedScenario && (
            <Button
              onClick={clearScenario}
              label="Clear Scenario"
              
              className="w-52 mt-2 text-sm bg-red-100 hover:bg-red-200"
            />
          )}
        </Box>
        {selectedScenario && (
          <Box className="flex flex-col items-center">
            <Text  margin={{ top: "small" }}>
              <b>Scenario:</b> {selectedScenario.text}
            </Text>
            {selectedScenario.note && (
              <Text className="text-xs" color="status-warning">
                <b>Note:</b> {selectedScenario.note}
              </Text>
            )}
            <Box className="flex flex-row gap-2">
              <Box className="flex flex-col md:flex-row md:gap-2">
                <Text className="text-sm" margin={{ top: "small" }}>
                  <b>Days:</b> {selectedScenario.days}
                </Text>
                <Text className="text-sm" margin={{ top: "small" }}>
                  <b>Budget:</b> {selectedScenario.budget}₹
                </Text>
              </Box>
              <Box className="flex flex-col md:flex-row md:gap-2">
                <Text className="text-sm" margin={{ top: "small" }}>
                  <b>Number of Hours of Work Required: </b>
                  {selectedScenario.hoursRequired}
                </Text>
                <Text className="text-sm" margin={{ top: "small" }}>
                  <b>Maximum Annotators Allowed: </b>
                  40
                </Text>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
      <Form onSubmit={calculate} className="flex flex-col w-full mt-4">
        <Box className="flex flex-col md:flex-row w-full md:gap-10">
          <Box className="flex flex-col md:w-1/2">
            <TextWithLabel
              value={days}
              disabled={!!selectedScenario}
              onChange={(e) => setDays(e.target.value)}
              label="Number of Days"
              type="number"
            />
            <TextWithLabel
              value={budget}
              disabled={!!selectedScenario}
              onChange={(e) => setBudget(e.target.value)}
              label="Budget (₹)"
              type="number"
            />
            <TextWithLabel
              value={hoursRequired}
              onChange={(e) => setHoursRequired(e.target.value)}
              label="Number of Hours of Work Required"
              type="number"
            />
          </Box>

          <Box className="flex flex-col md:w-1/2">
            <TextWithLabel
              value={annotators}
              onChange={(e) => setAnnotators(e.target.value)}
              label="Number of Annotators"
              type="number"
              max={selectedScenario ? 40 : undefined}
            />
            <TextWithLabel
              value={wagePerAnnotator}
              onChange={(e) => setWagePerAnnotator(e.target.value)}
              label="Wage per Annotator per Hour (₹)"
              type="number"
            />
            <TextWithLabel
              value={hoursPerDay}
              onChange={(e) => setHoursPerDay(e.target.value)}
              label="Hours per Annotator per Day"
              type="number"
            />
          </Box>
        </Box>
        <Button
          type="submit"
          label="Calculate"
          primary
          margin={{ top: "small" }}
        />
      </Form>

      {alert && (
        <Box>
          <Text  color="status-error" margin={{ top: "small" }}>
            {alert}
          </Text>
        </Box>
      )}

      {results && (
        <Box margin={{ top: "small" }}>
          <Heading level={4} margin={{ top: "0", bottom: "0" }}>
            Summary:
          </Heading>
          <Text >
            Number of days the task will take:{" "}
            <b
              className={`${
                results.totalDaysRequired > days ? "text-red-500" : ""
              }`}
            >
              {results.totalDaysRequired} Days{" "}
              {results.totalDaysRequired > days && (
                <span>
                  ({results.totalDaysRequired - days} more days than allotted)
                </span>
              )}
            </b>
          </Text>
          <Text >
            Total Cost of Data Work: <b>{results.totalCost} Rs.</b>
          </Text>
          <Text >
            Money Left:{" "}
            <b className={`${results.moneyLeft < 0 ? "text-red-500" : ""}`}>
              {results.moneyLeft} Rs.
            </b>
          </Text>
          <Text >
            Operation Status:{" "}
            <b
              className={`${
                results.operationStatus === "Not Feasible" ? "text-red-500" : ""
              }`}
            >
              {results.operationStatus}
            </b>
          </Text>

          {results.operationStatus === "Not Feasible" && (
            <Box>
              <Image src={lose} className="w-64" />
            </Box>
          )}

          <Button
            onClick={clearResults}
            label="Clear"
            
            className="w-20 mt-1 text-sm bg-red-100 hover:bg-red-200 rounded-md  "
          />
        </Box>
      )}
    </Box>
  );
};

const DataworksGamePage = () => {
  return (
    <AppShell>
      <Box align="center" margin={"large"}>
        <Box width={"large"}>
          <Heading level={2} alignSelf="center">
            Make An Offer They Can’t Refuse
          </Heading>

          <Text  margin={{ bottom: "medium" }}>
            The game is a group-based exercise around the data sourcing and
            annotation experience. Emulating the limited resources available in
            the real world, players must think of creative ways to complete
            annotation tasks done in different systems.
          </Text>

          <Heading level={3}>The Backdrop</Heading>
          <Text  margin={{ bottom: "medium" }}>
            Datasets used to train AI are often labeled/annotated. This work is
            done by data annotators. It has been reported that data annotators
            are often underpaid and exploited, see{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://time.com/6247678/openai-chatgpt-kenya-workers/"
            >
              here
            </a>
            ,{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.technologyreview.com/2022/04/20/1050392/ai-industry-appen-scale-data-labels/"
            >
              here
            </a>
            . There have been several discussions and attempts to understand how
            data workers must be compensated, and their work valued (see{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://partnershiponai.org/wp-content/uploads/2021/08/PAI-Responsible-Sourcing-of-Data-Enrichment-Services.pdf"
            >
              here
            </a>{" "}
            and{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://dl.acm.org/doi/pdf/10.1145/3637367"
            >
              here
            </a>
            ). This game is an attempt to think through and explore how we may
            arrive at answers to these critical questions by placing players in
            the shoes of data vendors who must ensure completion of tasks with
            limited resources. It flips the present dynamic between a vendor and
            annotators to one where it's the data vendors who must convince
            annotators to come onboard under the terms they have set out.
            Players are therefore pushed to compute and create a compensation
            model under real-world constraints in a ‘fair’ manner, and/or
            propose creative alternatives to supplant the model.
          </Text>

          <Heading level={3}>Why is Tattle doing this?</Heading>
          <Text>In 2023, with support from Mozilla through the Data Futures Lab, we began thinking through our annotation process in building Uli, and arrived at a question: “How can we recognise the contributions of the annotators who work with us on Uli beyond monetary compensation?” We have been speaking with stakeholders and data workers to address this question of value and recognition for data annotators; you can read more about it <a href="https://uli.tattle.co.in/blog/approach-data-annotation/" rel="noopener noreferrer" target="_blank">here</a>. This activity frames this question, and opens up the room for people to participate in developing models of compensation for a data annotation pipeline.</Text>

          <Heading className="text-3xl">Game Play</Heading>

          <Heading level={3}>Goal</Heading>
          <Text
       
            margin={{ bottom: "medium" }}
            className="font-semibold"
          >
            {/* A group of players take on the persona of a Data
              Vendor and are given a task. There are some constraints on budget
              and the number of days in which you have to give the data back to
              the Data Client. Your job is to make a pitch to data annotators
              describing their wage and other benefits. */}
            Your job is to make a pitch to data annotators describing their wage
            and other benefits.
          </Text>

          <Box border={"all"} className=" w-fit md:w-[65%] flex self-center">
            <StaticImage
              src="../images/dataworks-game-personas.png"
              alt="Personas"
            ></StaticImage>
          </Box>
          <Text  className="mt-4">
            <b>Personas:</b> Data Vendor, Data Annotator and Data Client (aka
            looming figure in the background waiting for the annotations to be
            delivered)
          </Text>

          <Heading level={3} className="mb-0">
            Set Up
          </Heading>
          <Text >
            <ul>
              <li>
                Each player is sorted into a group of 4-5 people (the group size
                can vary).
              </li>
              <li>
                Groups represent organizations/entities (Data Vendors) seeking
                qualified data annotators for annotation tasks.
              </li>
              <li>
                The goal is to train AI-assisted service offerings using the
                annotated data.
              </li>
              <li>
                Each group must make a pitch to the audience (who represent the
                data annotators) as to why they should work with each
                organization/entity.
              </li>
              <li>
                The groups are constrained by the scenarios they get, i.e.,
                money for each task, and the time period to complete the
                project.
              </li>
            </ul>
          </Text>

          <Heading level={3} className="mb-2">
            The Rules of the Game
          </Heading>
          <Text >
            <ul>
              <li>
                Each group gets a scenario, budget, and dataset size, some with
                additional conditions.
              </li>
              <li>
                The information from the scenario allotted to each group is
                immutable. It forms the baseline for the activity.
              </li>
              <li>
                The group must then prepare a pitch to up to{" "}
                <b>
                  40 annotators (can be imaginary/ think of the other people in
                  the room as the annotators)
                </b>{" "}
                to convince them to work for them within these constraints.
              </li>
              <li>
                Each group has <b>15-20 minutes</b> to prepare.
              </li>
              <li>
                With the given information, the groups make a 1-minute pitch.
              </li>
              <li>
                Whoever has the best compensation model wins. Brownie points for
                the most creative one.
              </li>
            </ul>
          </Text>

          <Heading className="mb-0" level={3}>
            Is there anything I need to set up?
          </Heading>
          <Text >
            <ul>
              <li>
                If you are playing offline, and have one disinterested friend
                who is better off as a timekeeper/referee, have them generate
                the scenarios on their phone and allot it to each of you.{" "}
              </li>
              <li>
                If you are a game nerd, you can also keep some colour markers
                and chart paper handy so each group can get creative with their
                pitches.
              </li>
              <li>
                If you are playing online, set up a meeting on a platform that
                allows you to breakout into groups, and have a timer handy.
              </li>
            </ul>
          </Text>

          <Heading level={3}>The Calculator</Heading>
          <Text  margin={{ bottom: "medium" }}>
            If you’d like to use the calculator as a standalone functionality
            outside of the game, please feel free to do so. Don’t click the
            generate scenario button, and you should be good to go.
          </Text>

          <DataworksGameCalculator />
        </Box>
      </Box>
    </AppShell>
  );
};

export default DataworksGamePage;
