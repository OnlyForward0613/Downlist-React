import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { useInView } from "react-intersection-observer";
import { path } from "server-path";
import Link from "next/link";
import { Dropdown } from "Components/Global/DropDownSelectMenu/DropDownSelectMenu";
import ListStyle from "Components/UserList/Styles/List.module.css";
import { StatsBadge } from "Components/Global/StatsBadge/StatsBadge";
import { NoItem } from "Components/Global/NoItemFound/NoItemFound";
import { CircularSpinner } from "Components/Global/CircularSpinner";

export function CoreList(props) {
    const {
        switch_item,
        data: dataFromUserList,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
        userID,
        setWhatToSortBy,
        refetch,
        clientData,
        isError,
        error,
        isLoading,
    } = props;

    const containerRef = useRef();

    const { ref, inView } = useInView({ threshold: 0 });

    const [stat, setStat] = useState("");
    //* sorting by options
    const options = [
        { genre_id: 1, name: "Favourite", _name: "fav" },
        switch_item !== "character"
            ? { genre_id: 2, name: "Score", _name: "score" }
            : {},
    ];

    //*sort by which ?

    // useEffect(() => {
    //     //* if the sort parameter is set , then first update the state and then refetch the query
    //     (async () => {
    //         await setWhatToSortBy(stat);
    //         await refetch({
    //             refetchPage: (lastPage, index, allPages) => {
    //                 return true;
    //             },
    //         });
    //     })();
    // }, [stat]);

    useEffect(() => {
        if (
            inView &&
            dataFromUserList?.pages[dataFromUserList?.pages.length - 1]?.list
                ?.length > 0
        ) {
            fetchNextPage();
        }
    }, [inView]);

    return (
        <>
            <h2 className={ListStyle["header"]}>
                {`${clientData?.name.split(" ")[0]}'s ${switch_item} List`}
            </h2>

            <ul
                className={ListStyle["search-container"]}
                ref={containerRef}
                style={
                    !dataFromUserList?.pages[0]?.list?.length
                        ? {
                              justifyContent: "center",
                          }
                        : {}
                }>
                <CircularSpinner enabled={isLoading} />
                {isError && (
                    <NoItem
                        refetchFn={refetch}
                        isForError={true}
                        content={error.response.data.message}
                    />
                )}
                {(!dataFromUserList || !dataFromUserList?.pages.length) &&
                    !isError &&
                    !isLoading && <NoItem />}
                {dataFromUserList?.pages[0]?.list?.length > 0 &&
                    dataFromUserList?.pages?.map((page) => {
                        return (
                            <div
                                className={ListStyle["groups"]}
                                key={page.nextPage}>
                                {page?.list?.map((item) => {
                                    const {
                                        favorites,
                                        malid,
                                        episodes,
                                        img_url,
                                        score,
                                        title,
                                    } = item;

                                    return (
                                        <Link
                                            href={`/${switch_item}/${malid}`}
                                            key={malid}>
                                            <a
                                                className={
                                                    ListStyle["items-container"]
                                                }>
                                                <div
                                                    className={
                                                        ListStyle[
                                                            "img-container"
                                                        ]
                                                    }>
                                                    <img src={img_url} alt="" />
                                                </div>
                                                <div
                                                    className={
                                                        ListStyle["details"]
                                                    }>
                                                    <div
                                                        className={
                                                            ListStyle["title"]
                                                        }>
                                                        <h4>
                                                            {title?.length > 35
                                                                ? title.substr(
                                                                      0,
                                                                      35
                                                                  ) + "..."
                                                                : title}
                                                        </h4>
                                                    </div>
                                                    <div
                                                        className={
                                                            ListStyle["stats"]
                                                        }>
                                                        <div
                                                            className={
                                                                ListStyle[
                                                                    "score"
                                                                ]
                                                            }>
                                                            <h4>
                                                                {score && score}
                                                            </h4>
                                                        </div>
                                                        <div
                                                            className={
                                                                ListStyle[
                                                                    "favorites"
                                                                ]
                                                            }>
                                                            {favorites && (
                                                                <StatsBadge
                                                                    content={
                                                                        favorites
                                                                    }
                                                                    badgeIcon="star"
                                                                    badgeIconStyle={{
                                                                        color: "yellow",
                                                                    }}
                                                                    badgeStyle={{
                                                                        backgroundColor:
                                                                            "transparent",
                                                                    }}
                                                                />
                                                            )}
                                                        </div>
                                                        <div
                                                            className={
                                                                ListStyle[
                                                                    "episodes"
                                                                ]
                                                            }>
                                                            {episodes && (
                                                                <StatsBadge
                                                                    content={
                                                                        episodes
                                                                    }
                                                                    badgeIcon="tv-outline"
                                                                    badgeStyle={{
                                                                        backgroundColor:
                                                                            "transparent",
                                                                    }}
                                                                />
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </a>
                                        </Link>
                                    );
                                })}
                            </div>
                        );
                    })}
                {}
            </ul>

            {dataFromUserList?.pages[0]?.list?.length > 0 && (
                <div className={ListStyle["thats-it"]} ref={ref}>
                    {inView && hasNextPage && isFetchingNextPage ? (
                        <CircularSpinner enabled={hasNextPage} />
                    ) : (
                        "Looks like that's it..."
                    )}
                </div>
            )}
            <div style={{ height: "100px" }}></div>
        </>
    );
}
