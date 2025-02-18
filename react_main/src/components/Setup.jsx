import React, { useContext, useRef } from "react";

import { GameContext, PopoverContext, UserContext } from "../Contexts";
import { RoleCount } from "./Roles";
import { Alignments } from "../Constants";
import { filterProfanity } from "./Basic";
import { hyphenDelimit } from "../utils";

import "../css/setup.css";
import "../css/roles.css";

export default function Setup(props) {
  const user = useContext(UserContext);
  const popover = useContext(PopoverContext);
  const setupRef = useRef();
  const maxRolesCount = props.maxRolesCount || 5;
  const disablePopover = props.disablePopover;

  var roleCounts, multi, useRoleGroups;
  var overSize = false;

  useRoleGroups = props.setup.useRoleGroups;

  if (typeof props.setup.roles == "string")
    props.setup.roles = JSON.parse(props.setup.roles);

  if (props.setup.closed && !useRoleGroups) {
    roleCounts = [];

    for (let alignment of Alignments[props.setup.gameType]) {
      roleCounts.push(
        <RoleCount
          closed
          alignment={alignment}
          count={props.setup.count[alignment]}
          gameType={props.setup.gameType}
          key={alignment}
        />
      );
    }
  } else {
    let roleNames = Object.keys(props.setup.roles[0]);
    multi = props.setup.roles.length > 1 && !useRoleGroups;

    roleCounts = roleNames.map((role) => (
      <RoleCount
        small
        role={role}
        count={props.setup.roles[0][role]}
        gameType={props.setup.gameType}
        key={role}
      />
    ));

    if (roleCounts.length > maxRolesCount) {
      roleCounts = roleCounts.slice(0, maxRolesCount);
      overSize = true;
    }
  }

  function onClick() {
    if (disablePopover) {
      return;
    }

    popover.onClick(
      `/setup/${props.setup.id}`,
      "setup",
      setupRef.current,
      filterProfanity(props.setup.name, user.settings),
      (data) => (data.roles = JSON.parse(data.roles))
    );
  }

  return (
    <div className="setup" ref={setupRef} onClick={onClick}>
      <GameIcon gameType={props.setup.gameType} />
      {useRoleGroups && <i className="multi-setup-icon fas fa-user-friends" />}
      {multi && <i className="multi-setup-icon fas fa-list-alt" />}
      {roleCounts}
      {overSize && <i className="fas fa-ellipsis-h" />}
    </div>
  );
}

export function SmallRoleList(props) {
  var roles;

  if (Array.isArray(props.roles)) {
    roles = props.roles.map((role) => (
      <RoleCount
        small
        role={role}
        makeRolePrediction={props.makeRolePrediction}
        key={role || "null"}
        showSecondaryHover
        gameType={props.gameType}
      />
    ));
  } else
    roles = Object.keys(props.roles).map((role) => (
      <RoleCount
        role={role}
        count={props.roles[role]}
        small={true}
        gameType={props.gameType}
        showSecondaryHover
        key={role}
      />
    ));

  return (
    <div className="small-role-list">
      {props.title} {roles}
    </div>
  );
}

export function GameIcon(props) {
  const gameType = hyphenDelimit(props.gameType);
  return <div className={`game-icon ${gameType}`}></div>;
}

export function GameStateIcon(props) {
  var iconName;

  if (props.state == "Day") iconName = "sun";
  else if (props.state == "Night") iconName = "moon";

  return <i className={`fa-${iconName} fas state-icon`} />;
}
