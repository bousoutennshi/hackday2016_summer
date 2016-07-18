create table user_setting (
    user_id varchar(255) NOT NULL,
    commodity_id int NOT NULL DEFAULT 0,
    limit_weight int NOT NULL DEFAULT 0,
    filter ENUM('on','off') DEFAULT 'off',
    status tinyint NOT NULL DEFAULT 0,
    counter int NOT NULL DEFAULT 0,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP() on update CURRENT_TIMESTAMP(),
    PRIMARY KEY(user_id,commodity_id)
) ENGINE=innoDB DEFAULT CHARSET=utf8;

create table commodity_history (
    user_id varchar(255) NOT NULL,
    commodity_id int NOT NULL DEFAULT 0,
    weight int NOT NULL DEFAULT 0,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP() on update CURRENT_TIMESTAMP(),
    PRIMARY KEY(user_id,commodity_id,update_time)
) ENGINE=innoDB DEFAULT CHARSET=utf8;

create table commodity_info (
    commodity_id int NOT NULL,
    commodity_name varchar(255) NOT NULL,
    full_weight int NOT NULL DEFAULT 0,
    PRIMARY KEY(commodity_id)
) ENGINE=innoDB DEFAULT CHARSET=utf8;
