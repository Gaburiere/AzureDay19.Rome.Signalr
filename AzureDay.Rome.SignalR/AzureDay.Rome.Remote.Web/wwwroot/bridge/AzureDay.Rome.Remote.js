/**
 * @version 1.0.0.0
 * @copyright Copyright ©  2019
 * @compiler Bridge.NET 17.2.0
 */
Bridge.assembly("AzureDay.Rome.Remote", function ($asm, globals) {
    "use strict";

    Bridge.define("AzureDay.Rome.Remote.Classes.WaitForMe$2", function (T, TK) { return {
        fields: {
            _complete: null,
            _eventInfo: null,
            _obj: Bridge.getDefaultValue(T),
            _handler: null
        },
        props: {
            Task: {
                get: function () {
                    return this._complete.task;
                }
            }
        },
        ctors: {
            init: function () {
                this._complete = new System.Threading.Tasks.TaskCompletionSource();
            },
            $ctor1: function (obj, eventNAme) {
                this.$initialize();
                this.Subscribe(obj, eventNAme);
            },
            ctor: function (obj, eventname) {
                this.$initialize();
                this.Subscribe(obj, eventname(obj));
            }
        },
        methods: {
            Subscribe: function (obj, eventName) {
                this._obj = obj;
                this._eventInfo = Bridge.Reflection.getMembers(T, 2, 284, eventName);
                if (this._eventInfo == null) {
                    throw new System.NullReferenceException.$ctor1(System.String.format("Event with name {0} not found on object of type {1}", eventName, T));
                }
                var methodInfo = Bridge.Reflection.getMembers(Bridge.getType(this), 8, 36 | 256, "OnComplete");

                if (methodInfo == null) {
                    throw new System.ArgumentNullException.$ctor1("methodinfo");
                }

                this._handler = Bridge.Reflection.createDelegate(methodInfo, this);
                Bridge.Reflection.midel(this._eventInfo.ad, obj)(this._handler);
            },
            OnComplete: function (sender, handler) {
                Bridge.Reflection.midel(this._eventInfo.r, this._obj)(this._handler);
                this._complete.trySetResult(handler);
            }
        }
    }; });

    Bridge.define("AzureDay.Rome.Remote.Configuration", {
        statics: {
            fields: {
                GameServer: null
            },
            ctors: {
                init: function () {
                    this.GameServer = "http://localhost:5000/play";
                }
            }
        }
    });

    Bridge.define("AzureDay.Rome.Remote.Hubs.IBaseHub", {
        $kind: "interface"
    });

    Bridge.define("AzureDay.Rome.Remote.Models.GameResult");

    Bridge.define("AzureDay.Rome.Remote.Models.GameState", {
        $kind: "enum",
        statics: {
            fields: {
                Closed: 0,
                Register: 1,
                InRun: 2,
                Finished: 3
            }
        }
    });

    Bridge.define("AzureDay.Rome.Remote.Models.player", {
        fields: {
            id: null,
            name: null,
            connectionid: null
        },
        ctors: {
            init: function () {
                this.id = new System.Guid();
            }
        }
    });

    Bridge.define("AzureDay.Rome.Remote.Models.team", {
        fields: {
            id: null,
            name: null
        },
        ctors: {
            init: function () {
                this.id = new System.Guid();
            }
        }
    });

    Bridge.define("AzureDay.Rome.Remote.ViewModels.GameResultViewModel", {
        inherits: [Bridge.Spaf.LoadableViewModel],
        methods: {
            ElementId: function () {
                return Bridge.Spaf.SpafApp.GameResultId;
            }
        }
    });

    Bridge.define("AzureDay.Rome.Remote.ViewModels.GameViewModel", {
        inherits: [Bridge.Spaf.LoadableViewModel],
        fields: {
            _gameHub: null,
            _teamId: null,
            Game: null
        },
        alias: [
            "OnLoad", "Bridge$Navigation$IAmLoadable$OnLoad",
            "OnLeave", "Bridge$Navigation$IAmLoadable$OnLeave"
        ],
        ctors: {
            init: function () {
                this._teamId = new System.Guid();
            },
            ctor: function (gameHub) {
                this.$initialize();
                Bridge.Spaf.LoadableViewModel.ctor.call(this);
                this._gameHub = gameHub;
                this.Game = ko.observable();
            }
        },
        methods: {
            ElementId: function () {
                return Bridge.Spaf.SpafApp.GameId;
            },
            GameHubOnOnGameStateReceived: function (sender, e) {
                this.Game(e);
                if (e === AzureDay.Rome.Remote.Models.GameState.InRun) {
                    this.SwitchToRunMode();
                }
            },
            SwitchToRunMode: function () {
                Bridge.global.alert("start the game!");
            },
            OnLoad: function (parameters) {
                var $step = 0,
                    $task1, 
                    $taskResult1, 
                    $jumpFromFinally, 
                    $asyncBody = Bridge.fn.bind(this, function () {
                        for (;;) {
                            $step = System.Array.min([0,1], $step);
                            switch ($step) {
                                case 0: {
                                    this._gameHub.AzureDay$Rome$Remote$Hubs$IGameHub$addOnGameStateReceived(Bridge.fn.cacheBind(this, this.GameHubOnOnGameStateReceived));
                                    this._gameHub.AzureDay$Rome$Remote$Hubs$IGameHub$addOnYourTeamWins(Bridge.fn.cacheBind(this, this.GameHubOnOnNotifyWinner));
                                    this._gameHub.AzureDay$Rome$Remote$Hubs$IGameHub$addOnYourTeamLost(Bridge.fn.cacheBind(this, this.GameHubOnOnYourTeamLost));

                                    this._teamId = Bridge.Spaf.SpafApp.TeamId;

                                    $task1 = this._gameHub.AzureDay$Rome$Remote$Hubs$IGameHub$GetGameMode();
                                    $step = 1;
                                    $task1.continueWith($asyncBody, true);
                                    return;
                                }
                                case 1: {
                                    $taskResult1 = $task1.getAwaitedResult();
                                    Bridge.Spaf.LoadableViewModel.prototype.OnLoad.call(this, parameters);
                                    return;
                                }
                                default: {
                                    return;
                                }
                            }
                        }
                    }, arguments);

                $asyncBody();
            },
            GameHubOnOnYourTeamLost: function (sender, e) {
                Bridge.global.alert("Hai perso!");
            },
            GameHubOnOnNotifyWinner: function (sender, e) {
                Bridge.global.alert("Hai vinto!");
            },
            OnLeave: function () {
                this._gameHub.AzureDay$Rome$Remote$Hubs$IGameHub$removeOnGameStateReceived(Bridge.fn.cacheBind(this, this.GameHubOnOnGameStateReceived));
                this._gameHub.AzureDay$Rome$Remote$Hubs$IGameHub$removeOnYourTeamWins(Bridge.fn.cacheBind(this, this.GameHubOnOnNotifyWinner));
                this._gameHub.AzureDay$Rome$Remote$Hubs$IGameHub$removeOnYourTeamLost(Bridge.fn.cacheBind(this, this.GameHubOnOnYourTeamLost));


                Bridge.Spaf.LoadableViewModel.prototype.OnLeave.call(this);
            },
            Tap: function () {
                this._gameHub.AzureDay$Rome$Remote$Hubs$IGameHub$Tap();
            }
        }
    });

    Bridge.define("AzureDay.Rome.Remote.ViewModels.RegisterViewModel", {
        inherits: [Bridge.Spaf.LoadableViewModel],
        fields: {
            _gameHub: null,
            _navigator: null,
            Name: null
        },
        ctors: {
            ctor: function (gameHub, navigator) {
                this.$initialize();
                Bridge.Spaf.LoadableViewModel.ctor.call(this);
                this._gameHub = gameHub;
                this._navigator = navigator;
                this.Name = ko.observable();
            }
        },
        methods: {
            ElementId: function () {
                return Bridge.Spaf.SpafApp.RegiserId;
            },
            Register: function () {
                var $step = 0,
                    $task1, 
                    $jumpFromFinally, 
                    $asyncBody = Bridge.fn.bind(this, function () {
                        for (;;) {
                            $step = System.Array.min([0,1], $step);
                            switch ($step) {
                                case 0: {
                                    if (System.String.isNullOrEmpty(this.Name())) {
                                        Bridge.global.alert("Inserisci un nome");
                                        return;
                                    }

                                    $task1 = this._gameHub.AzureDay$Rome$Remote$Hubs$IGameHub$Register(this.Name(), Bridge.Spaf.SpafApp.TeamId);
                                    $step = 1;
                                    $task1.continueWith($asyncBody, true);
                                    return;
                                }
                                case 1: {
                                    $task1.getAwaitedResult();
                                    this._navigator.Bridge$Navigation$INavigator$Navigate(Bridge.Spaf.SpafApp.GameId, void 0);
                                    return;
                                }
                                default: {
                                    return;
                                }
                            }
                        }
                    }, arguments);

                $asyncBody();
            }
        }
    });

    Bridge.define("AzureDay.Rome.Remote.ViewModels.WaitingViewModel", {
        inherits: [Bridge.Spaf.LoadableViewModel],
        fields: {
            _gameHub: null,
            _navigator: null
        },
        alias: [
            "OnLeave", "Bridge$Navigation$IAmLoadable$OnLeave",
            "OnLoad", "Bridge$Navigation$IAmLoadable$OnLoad"
        ],
        ctors: {
            ctor: function (gameHub, navigator) {
                this.$initialize();
                Bridge.Spaf.LoadableViewModel.ctor.call(this);
                this._gameHub = gameHub;
                this._navigator = navigator;
            }
        },
        methods: {
            ElementId: function () {
                return Bridge.Spaf.SpafApp.WaitingId;
            },
            GameHubOnOnGameStateReceived: function (sender, e) {
                if (e === AzureDay.Rome.Remote.Models.GameState.Register) {
                    this._navigator.Bridge$Navigation$INavigator$Navigate(Bridge.Spaf.SpafApp.RegiserId, void 0);
                }
            },
            OnLeave: function () {
                Bridge.Spaf.LoadableViewModel.prototype.OnLeave.call(this);
                this._gameHub.AzureDay$Rome$Remote$Hubs$IGameHub$removeOnGameStateReceived(Bridge.fn.cacheBind(this, this.GameHubOnOnGameStateReceived));
            },
            OnLoad: function (parameters) {
                var $step = 0,
                    $task1, 
                    $taskResult1, 
                    $jumpFromFinally, 
                    e, 
                    mode, 
                    $asyncBody = Bridge.fn.bind(this, function () {
                        for (;;) {
                            $step = System.Array.min([0,1], $step);
                            switch ($step) {
                                case 0: {
                                    Bridge.Spaf.LoadableViewModel.prototype.OnLoad.call(this, parameters);

                                    try {
                                        Bridge.Spaf.SpafApp.TeamId = Bridge.Navigation.NavigationUtility.GetParameter(System.Guid, parameters, "teamId");
                                    }
                                    catch (e) {
                                        e = System.Exception.create(e);
                                        Bridge.global.alert("Errore, non trovo il team id!");
                                        throw e;
                                    }


                                    $task1 = this._gameHub.AzureDay$Rome$Remote$Hubs$IGameHub$GetGameMode();
                                    $step = 1;
                                    $task1.continueWith($asyncBody, true);
                                    return;
                                }
                                case 1: {
                                    $taskResult1 = $task1.getAwaitedResult();
                                    mode = $taskResult1;

                                    switch (mode) {
                                        case AzureDay.Rome.Remote.Models.GameState.Closed: 
                                            this._gameHub.AzureDay$Rome$Remote$Hubs$IGameHub$addOnGameStateReceived(Bridge.fn.cacheBind(this, this.GameHubOnOnGameStateReceived));
                                            break;
                                        case AzureDay.Rome.Remote.Models.GameState.Register: 
                                            this._navigator.Bridge$Navigation$INavigator$Navigate(Bridge.Spaf.SpafApp.RegiserId, void 0);
                                            break;
                                        case AzureDay.Rome.Remote.Models.GameState.InRun: 
                                            Bridge.global.alert("Dovevi essere piu veloce.. il gioco è già in corso.");
                                            break;
                                        case AzureDay.Rome.Remote.Models.GameState.Finished: 
                                            Bridge.global.alert("Il gioco è concluso.. resta in attesa nel caso iniziasse una nuova corsa.");
                                            break;
                                        default: 
                                            throw new System.ArgumentOutOfRangeException.ctor();
                                    }
                                    return;
                                }
                                default: {
                                    return;
                                }
                            }
                        }
                    }, arguments);

                $asyncBody();
            }
        }
    });

    Bridge.define("Bridge.Spaf.CustomRoutesConfig", {
        inherits: [Bridge.Navigation.BridgeNavigatorConfigBase],
        fields: {
            Body: null,
            HomeId: null,
            DisableAutoSpafAnchorsOnNavigate: false
        },
        alias: [
            "CreateRoutes", "Bridge$Navigation$INavigatorConfigurator$CreateRoutes",
            "Body", "Bridge$Navigation$INavigatorConfigurator$Body",
            "HomeId", "Bridge$Navigation$INavigatorConfigurator$HomeId",
            "DisableAutoSpafAnchorsOnNavigate", "Bridge$Navigation$INavigatorConfigurator$DisableAutoSpafAnchorsOnNavigate"
        ],
        ctors: {
            init: function () {
                this.Body = $("#pageBody");
                this.HomeId = Bridge.Spaf.SpafApp.WaitingId;
                this.DisableAutoSpafAnchorsOnNavigate = true;
            }
        },
        methods: {
            CreateRoutes: function () {
                return function (_o1) {
                        var $t;
                        _o1.add(($t = new Bridge.Navigation.PageDescriptor(), $t.CanBeDirectLoad = function () {
                            return true;
                        }, $t.HtmlLocation = function () {
                            return "pages/waiting.html";
                        }, $t.Key = Bridge.Spaf.SpafApp.WaitingId, $t.PageController = function () {
                            return Bridge.Spaf.SpafApp.Container.Bridge$Ioc$IIoc$Resolve(AzureDay.Rome.Remote.ViewModels.WaitingViewModel);
                        }, $t));
                        _o1.add(($t = new Bridge.Navigation.PageDescriptor(), $t.CanBeDirectLoad = function () {
                            return false;
                        }, $t.HtmlLocation = function () {
                            return "pages/register.html";
                        }, $t.Key = Bridge.Spaf.SpafApp.RegiserId, $t.PageController = function () {
                            return Bridge.Spaf.SpafApp.Container.Bridge$Ioc$IIoc$Resolve(AzureDay.Rome.Remote.ViewModels.RegisterViewModel);
                        }, $t));
                        _o1.add(($t = new Bridge.Navigation.PageDescriptor(), $t.CanBeDirectLoad = function () {
                            return false;
                        }, $t.HtmlLocation = function () {
                            return "pages/game.html";
                        }, $t.Key = Bridge.Spaf.SpafApp.GameId, $t.PageController = function () {
                            return Bridge.Spaf.SpafApp.Container.Bridge$Ioc$IIoc$Resolve(AzureDay.Rome.Remote.ViewModels.GameViewModel);
                        }, $t));
                        _o1.add(($t = new Bridge.Navigation.PageDescriptor(), $t.CanBeDirectLoad = function () {
                            return false;
                        }, $t.HtmlLocation = function () {
                            return "pages/gameResult.html";
                        }, $t.Key = Bridge.Spaf.SpafApp.GameResultId, $t.PageController = function () {
                            return Bridge.Spaf.SpafApp.Container.Bridge$Ioc$IIoc$Resolve(AzureDay.Rome.Remote.ViewModels.GameResultViewModel);
                        }, $t));
                        return _o1;
                    }(new (System.Collections.Generic.List$1(Bridge.Navigation.IPageDescriptor)).ctor());
            }
        }
    });

    Bridge.define("Bridge.Spaf.SpafApp", {
        main: function Main () {
            Bridge.Spaf.SpafApp.Container = new Bridge.Ioc.BridgeIoc();
            Bridge.Spaf.SpafApp.ContainerConfig();

            var hub = Bridge.Spaf.SpafApp.Container.Bridge$Ioc$IIoc$Resolve(AzureDay.Rome.Remote.Hubs.IGameHub);
            hub.AzureDay$Rome$Remote$Hubs$IBaseHub$Start(function () {
                Bridge.Spaf.SpafApp.Container.Bridge$Ioc$IIoc$Resolve(Bridge.Navigation.INavigator).Bridge$Navigation$INavigator$InitNavigation();
            });

            hub.AzureDay$Rome$Remote$Hubs$IGameHub$addOnNewPlayerInYourTeamJoined(function (sender, player) {
                Bridge.global.alert(System.String.format("La tua squadra ha un nuovo player: {0}", [player.name]));
            });

        },
        statics: {
            fields: {
                TeamId: null,
                Container: null
            },
            props: {
                WaitingId: {
                    get: function () {
                        return "waiting";
                    }
                },
                GameId: {
                    get: function () {
                        return "game";
                    }
                },
                GameResultId: {
                    get: function () {
                        return "gameResult";
                    }
                },
                RegiserId: {
                    get: function () {
                        return "register";
                    }
                }
            },
            ctors: {
                init: function () {
                    this.TeamId = new System.Guid();
                }
            },
            methods: {
                ContainerConfig: function () {
                    Bridge.Spaf.SpafApp.Container.Bridge$Ioc$IIoc$RegisterSingleInstance$3(Bridge.Navigation.INavigator, Bridge.Navigation.BridgeNavigatorWithRouting);
                    Bridge.Spaf.SpafApp.Container.Bridge$Ioc$IIoc$RegisterSingleInstance$3(Bridge.Navigation.IBrowserHistoryManager, Bridge.Navigation.QueryParameterNavigationHistory);
                    Bridge.Spaf.SpafApp.Container.Bridge$Ioc$IIoc$Register$4(Bridge.Navigation.INavigatorConfigurator, Bridge.Spaf.CustomRoutesConfig);

                    Bridge.Spaf.SpafApp.Container.Bridge$Ioc$IIoc$RegisterSingleInstance$3(Bridge.Messenger.IMessenger, Bridge.Messenger.Messenger);

                    Bridge.Spaf.SpafApp.RegisterAllViewModels();

                    Bridge.Spaf.SpafApp.Container.Bridge$Ioc$IIoc$RegisterSingleInstance$3(AzureDay.Rome.Remote.Hubs.IGameHub, AzureDay.Rome.Remote.Hubs.Impl.GameHub);


                },
                /**
                 * Register all types that end with "viewmodel".
                 You can register a viewmode as Singlr Instance adding "SingleInstanceAttribute" to the class
                 *
                 * @static
                 * @private
                 * @this Bridge.Spaf.SpafApp
                 * @memberof Bridge.Spaf.SpafApp
                 * @return  {void}
                 */
                RegisterAllViewModels: function () {
                    var types = System.Linq.Enumerable.from(System.AppDomain.getAssemblies()).selectMany(function (s) {
                            return Bridge.Reflection.getAssemblyTypes(s);
                        }).where(function (w) {
                        return System.String.endsWith(Bridge.Reflection.getTypeName(w).toLowerCase(), "viewmodel");
                    }).toList(Function);

                    types.ForEach(function (f) {
                        var attributes = Bridge.Reflection.getAttributes(f, Bridge.Spaf.Attributes.SingleInstanceAttribute, true);

                        if (System.Linq.Enumerable.from(attributes).any()) {
                            Bridge.Spaf.SpafApp.Container.Bridge$Ioc$IIoc$RegisterSingleInstance(f);
                        } else {
                            Bridge.Spaf.SpafApp.Container.Bridge$Ioc$IIoc$Register(f);
                        }
                    });

                }
            }
        }
    });

    Bridge.define("Bridge.Spaf.SpafApp.Messages", {
        $kind: "nested class",
        statics: {
            fields: {
                Sender: null
            },
            ctors: {
                init: function () {
                    this.Sender = new Bridge.Spaf.SpafApp.Messages.GlobalSender();
                }
            }
        }
    });

    Bridge.define("Bridge.Spaf.SpafApp.Messages.GlobalSender", {
        $kind: "nested class"
    });

    Bridge.define("AzureDay.Rome.Remote.Hubs.IGameHub", {
        inherits: [AzureDay.Rome.Remote.Hubs.IBaseHub],
        $kind: "interface"
    });

    Bridge.define("AzureDay.Rome.Remote.Hubs.Impl.GameHub", {
        inherits: [AzureDay.Rome.Remote.Hubs.IGameHub],
        fields: {
            _connection: null
        },
        events: {
            OnNewPlayerInYourTeamJoined: null,
            OnRegisterDone: null,
            OnGameStateReceived: null,
            OnYourTeamWins: null,
            OnYourTeamLost: null
        },
        alias: [
            "addOnNewPlayerInYourTeamJoined", "AzureDay$Rome$Remote$Hubs$IGameHub$addOnNewPlayerInYourTeamJoined",
            "removeOnNewPlayerInYourTeamJoined", "AzureDay$Rome$Remote$Hubs$IGameHub$removeOnNewPlayerInYourTeamJoined",
            "addOnRegisterDone", "AzureDay$Rome$Remote$Hubs$IGameHub$addOnRegisterDone",
            "removeOnRegisterDone", "AzureDay$Rome$Remote$Hubs$IGameHub$removeOnRegisterDone",
            "addOnGameStateReceived", "AzureDay$Rome$Remote$Hubs$IGameHub$addOnGameStateReceived",
            "removeOnGameStateReceived", "AzureDay$Rome$Remote$Hubs$IGameHub$removeOnGameStateReceived",
            "addOnYourTeamWins", "AzureDay$Rome$Remote$Hubs$IGameHub$addOnYourTeamWins",
            "removeOnYourTeamWins", "AzureDay$Rome$Remote$Hubs$IGameHub$removeOnYourTeamWins",
            "addOnYourTeamLost", "AzureDay$Rome$Remote$Hubs$IGameHub$addOnYourTeamLost",
            "removeOnYourTeamLost", "AzureDay$Rome$Remote$Hubs$IGameHub$removeOnYourTeamLost",
            "Start", "AzureDay$Rome$Remote$Hubs$IBaseHub$Start",
            "Stop", "AzureDay$Rome$Remote$Hubs$IBaseHub$Stop",
            "Tap", "AzureDay$Rome$Remote$Hubs$IGameHub$Tap",
            "Register", "AzureDay$Rome$Remote$Hubs$IGameHub$Register",
            "GetGameMode", "AzureDay$Rome$Remote$Hubs$IGameHub$GetGameMode"
        ],
        ctors: {
            ctor: function () {
                this.$initialize();
                this._connection = new signalR.HubConnectionBuilder().withUrl(AzureDay.Rome.Remote.Configuration.GameServer).build();

                this._connection.on("registerDone", Bridge.fn.bind(this, function () {
                    !Bridge.staticEquals(this.OnRegisterDone, null) ? this.OnRegisterDone(this, null) : null;
                }));

                this._connection.on("gameStateMode", Bridge.fn.bind(this, function (gameState) {
                    !Bridge.staticEquals(this.OnGameStateReceived, null) ? this.OnGameStateReceived(this, gameState) : null;
                }));


                this._connection.on("newPlayerInThisGroup", Bridge.fn.bind(this, function (player) {
                    !Bridge.staticEquals(this.OnNewPlayerInYourTeamJoined, null) ? this.OnNewPlayerInYourTeamJoined(this, player) : null;
                }));

                this._connection.on("yourTeamWins", Bridge.fn.bind(this, function () {
                    !Bridge.staticEquals(this.OnYourTeamWins, null) ? this.OnYourTeamWins(this, null) : null;
                }));

                this._connection.on("yourTeamLost", Bridge.fn.bind(this, function () {
                    !Bridge.staticEquals(this.OnYourTeamLost, null) ? this.OnYourTeamLost(this, null) : null;
                }));

            }
        },
        methods: {
            Start: function (onStarted) {
                this._connection.start().then(function () {
                    !Bridge.staticEquals(onStarted, null) ? onStarted() : null;
                }, function (o) {
                    Bridge.global.alert(Bridge.toString(o));
                });
            },
            Stop: function () {
                this._connection.stop();
            },
            Tap: function () {
                this._connection.send("tap");
            },
            Register: function (name, team) {
                var waitForMe = new (AzureDay.Rome.Remote.Classes.WaitForMe$2(AzureDay.Rome.Remote.Hubs.IGameHub,AzureDay.Rome.Remote.Models.GameState)).ctor(this, function (hub) {
                    return "OnRegisterDone";
                });
                this._connection.send("register", name, team);
                return waitForMe.Task;
            },
            GetGameMode: function () {
                var waitForMe = new (AzureDay.Rome.Remote.Classes.WaitForMe$2(AzureDay.Rome.Remote.Hubs.IGameHub,AzureDay.Rome.Remote.Models.GameState)).ctor(this, function (hub) {
                    return "OnGameStateReceived";
                });
                this._connection.send("getStateMode");
                return waitForMe.Task;
            }
        }
    });
});

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJBenVyZURheS5Sb21lLlJlbW90ZS5qcyIsCiAgInNvdXJjZVJvb3QiOiAiIiwKICAic291cmNlcyI6IFsiQ2xhc3Nlcy9XYWl0Rm9yTWUuY3MiLCJWaWV3TW9kZWxzL0dhbWVSZXN1bHRWaWV3TW9kZWwuY3MiLCJWaWV3TW9kZWxzL0dhbWVWaWV3TW9kZWwuY3MiLCJWaWV3TW9kZWxzL1JlZ2lzdGVyVmlld01vZGVsLmNzIiwiVmlld01vZGVscy9XYWl0aW5nVmlld01vZGVsLmNzIiwiQ3VzdG9tUm91dGVzQ29uZmlnLmNzIiwiU3BhZkFwcC5jcyIsIkh1YnMvSW1wbC9HYW1lSHViLmNzIl0sCiAgIm5hbWVzIjogWyIiXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7b0JBaUJRQSxPQUFPQTs7Ozs7O2lDQVQrQ0EsSUFBSUE7OzhCQVl6Q0EsS0FBT0E7O2dCQUVwQkEsZUFBZUEsS0FBS0E7OzRCQUdQQSxLQUFPQTs7Z0JBRXBCQSxlQUFlQSxLQUFLQSxVQUFpQkE7Ozs7aUNBR2xCQSxLQUFPQTtnQkFFMUJBLFlBQVlBO2dCQUNaQSxrQkFBa0JBLDZCQUFPQSxXQUFZQTtnQkFDckNBLElBQUlBLG1CQUFtQkE7b0JBQ25CQSxNQUFNQSxJQUFJQSxxQ0FBdUJBLDRFQUFvRUEsV0FBVUEsQUFBT0E7O2dCQUMxSEEsaUJBQWlCQSxzREFBdUNBOztnQkFFeERBLElBQUlBLGNBQWNBO29CQUNkQSxNQUFNQSxJQUFJQTs7O2dCQUVkQSxnQkFBZ0JBLGlDQUEwQ0EsWUFBTkE7Z0JBQ3BEQSw0Q0FBZ0NBLEtBQUtBOztrQ0FHakJBLFFBQWVBO2dCQUVuQ0EsMkNBQW1DQSxXQUFXQTtnQkFDOUNBLDRCQUE0QkE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2dCQ3hDcENBLE9BQU9BOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs0QkNja0JBOzs7Z0JBRWpCQSxnQkFBZ0JBO2dCQUNoQkEsWUFBWUE7Ozs7O2dCQVJwQkEsT0FBT0E7O29EQVd1Q0EsUUFBZUE7Z0JBRXJEQSxVQUFlQTtnQkFDZkEsSUFBSUEsTUFBS0E7b0JBQ0xBOzs7O2dCQUtKQTs7OEJBSThCQTs7Ozs7Ozs7OztvQ0FFOUJBLHdFQUFxQ0E7b0NBQ3JDQSxtRUFBZ0NBO29DQUNoQ0EsbUVBQWdDQTs7b0NBRWhDQSxlQUFlQTs7b0NBRWZBLFNBQU1BOzs7Ozs7O29DQUNOQSwwREFBWUE7Ozs7Ozs7Ozs7OzsrQ0FHcUJBLFFBQWVBO2dCQUVoREE7OytDQUdpQ0EsUUFBZUE7Z0JBRWhEQTs7O2dCQU1BQSwyRUFBcUNBO2dCQUNyQ0Esc0VBQWdDQTtnQkFDaENBLHNFQUFnQ0E7OztnQkFHaENBOzs7Z0JBS0FBOzs7Ozs7Ozs7Ozs7OzRCQ3hEcUJBLFNBQWtCQTs7O2dCQUV2Q0EsZ0JBQWdCQTtnQkFDaEJBLGtCQUFrQkE7Z0JBQ2xCQSxZQUFZQTs7Ozs7Z0JBUnBCQSxPQUFPQTs7Ozs7Ozs7Ozs7b0NBYUNBLElBQUlBLDRCQUFxQkE7d0NBRXJCQTt3Q0FDQUE7OztvQ0FHSkEsU0FBTUEsMERBQXVCQSxhQUFpQkE7Ozs7Ozs7b0NBQzlDQSxzREFBeUJBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs0QkNqQkxBLFNBQWtCQTs7O2dCQUV0Q0EsZ0JBQWdCQTtnQkFDaEJBLGtCQUFrQkE7Ozs7O2dCQUwxQkEsT0FBT0E7O29EQVF1Q0EsUUFBZUE7Z0JBRXJEQSxJQUFHQSxNQUFLQTtvQkFDSkEsc0RBQXlCQTs7OztnQkFLN0JBO2dCQUNBQSwyRUFBcUNBOzs4QkFHUEE7Ozs7Ozs7Ozs7OztvQ0FFOUJBLDBEQUFZQTs7b0NBRVpBO3dDQUVJQSw2QkFBaUJBOzs7O3dDQUlqQkE7d0NBQ0FBOzs7O29DQUlKQSxTQUFpQkE7Ozs7Ozs7MkNBQU5BOztvQ0FFWEEsUUFBUUE7d0NBRUpBLEtBQUtBOzRDQUNEQSx3RUFBcUNBOzRDQUNyQ0E7d0NBQ0pBLEtBQUtBOzRDQUNEQSxzREFBeUJBOzRDQUN6QkE7d0NBQ0pBLEtBQUtBOzRDQUNEQTs0Q0FDQUE7d0NBQ0pBLEtBQUtBOzRDQUNEQTs0Q0FDQUE7d0NBQ0pBOzRDQUNJQSxNQUFNQSxJQUFJQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs0QkN2QmVBOzhCQUEwRUE7Ozs7OztnQkFuQzNHQSxPQUFPQSxBQUEwREEsVUFBQ0E7O3dCQUFPQSxRQUFRQSxVQUFJQSx5REFFM0RBOzs2Q0FDSEE7O29DQUNUQSxtREFDV0E7bUNBQU1BOzt3QkFDeEJBLFFBQVFBLFVBQUlBLHlEQUVPQTs7NkNBQ0hBOztvQ0FDVEEsbURBQ1dBO21DQUFNQTs7d0JBQ3hCQSxRQUFRQSxVQUFJQSx5REFFT0E7OzZDQUNIQTs7b0NBQ1RBLGdEQUNXQTttQ0FBTUE7O3dCQUN4QkEsUUFBUUEsVUFBSUEseURBRU9BOzs2Q0FDSEE7O29DQUNUQSxzREFDV0E7bUNBQU1BOzt3QkFDeEJBLE9BQU9BO3NCQXhCdUJBLEtBQUlBOzs7Ozs7O1lDV3pDQSxnQ0FBWUEsSUFBSUE7WUFDaEJBOztZQUVBQSxVQUFVQTtZQUNWQSw2Q0FBVUEsQUFBd0JBO2dCQUU5QkE7OztZQUdKQSxzRUFBbUNBLFVBQUNBLFFBQVFBO2dCQUV4Q0Esb0JBQWFBLGdFQUF1REE7Ozs7Ozs7Ozs7Ozt3QkE4QjVFQTs7Ozs7d0JBTUFBOzs7Ozt3QkFNQUE7Ozs7O3dCQU1BQTs7Ozs7Ozs7Ozs7b0JBeENJQTtvQkFDQUE7b0JBRUFBOztvQkFHQUE7O29CQUdBQTs7b0JBR0FBOzs7Ozs7Ozs7Ozs7Ozs7b0JBdURBQSxZQUFZQSw0QkFBMEZBLDZDQUF3Q0EsQUFBK0hBO21DQUFLQTtpQ0FDdlFBLEFBQWlEQTsrQkFBS0E7OztvQkFFakVBLGNBQWNBLEFBQTZDQTt3QkFFdkRBLGlCQUFpQkEsbUNBQXNCQSxBQUFPQTs7d0JBRTlDQSxJQUFJQSw0QkFBbUNBOzRCQUNuQ0EscUVBQWlDQTs7NEJBRWpDQSx1REFBbUJBOzs7Ozs7Ozs7Ozs7Ozs7OztrQ0F6QlNBLElBQUlBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztnQkN2RXhDQSxtQkFBb0JBLElBQUlBLHVDQUErQkE7O2dCQUV2REEsb0NBQW1DQSxBQUFXQTtvQkFFMUNBLDBDQUFxQkEsUUFBS0EsQUFBcUNBLG9CQUEyQkEsTUFBS0EsUUFBT0E7OztnQkFHMUdBLHFDQUFvQ0EsQUFBc0JBLCtCQUFDQTtvQkFFdkRBLCtDQUEwQkEsUUFBS0EsQUFBcUNBLHlCQUFnQ0EsTUFBS0EsYUFBWUE7Ozs7Z0JBSXpIQSw0Q0FBMkNBLEFBQW1CQSwrQkFBQ0E7b0JBRTNEQSx1REFBa0NBLFFBQUtBLEFBQXFDQSxpQ0FBd0NBLE1BQUtBLFVBQVNBOzs7Z0JBR3RJQSxvQ0FBbUNBLEFBQVdBO29CQUUxQ0EsMENBQXFCQSxRQUFLQSxBQUFxQ0Esb0JBQTJCQSxNQUFLQSxRQUFPQTs7O2dCQUcxR0Esb0NBQW1DQSxBQUFXQTtvQkFFMUNBLDBDQUFxQkEsUUFBS0EsQUFBcUNBLG9CQUEyQkEsTUFBS0EsUUFBT0E7Ozs7Ozs2QkFLNUZBO2dCQUVkQSw4QkFBOEJBLEFBQXdCQTtvQkFBS0EsZ0NBQVdBLFFBQUtBLEFBQXFDQSxjQUFvQkE7bUJBQU1BLEFBQWdDQTtvQkFBS0Esb0JBQWFBOzs7O2dCQUs1TEE7OztnQkFLQUE7O2dDQUdpQkEsTUFBYUE7Z0JBRTlCQSxnQkFBZ0JBLEtBQUlBLHlIQUErQkEsTUFBTUE7OztnQkFDekRBLGtDQUFpQ0EsTUFBS0E7Z0JBQ3RDQSxPQUFPQTs7O2dCQUtQQSxnQkFBZ0JBLEtBQUlBLHlIQUErQkEsTUFBTUE7OztnQkFDekRBO2dCQUNBQSxPQUFPQSIsCiAgInNvdXJjZXNDb250ZW50IjogWyJ1c2luZyBTeXN0ZW07XG51c2luZyBTeXN0ZW0uUmVmbGVjdGlvbjtcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XG5cbm5hbWVzcGFjZSBBenVyZURheS5Sb21lLlJlbW90ZS5DbGFzc2VzXG57XG4gICAgaW50ZXJuYWwgY2xhc3MgV2FpdEZvck1lPFQsIFRLPlxuICAgIHtcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBUYXNrQ29tcGxldGlvblNvdXJjZTxUSz4gX2NvbXBsZXRlID0gbmV3IFRhc2tDb21wbGV0aW9uU291cmNlPFRLPigpO1xuXG4gICAgICAgIHByaXZhdGUgRXZlbnRJbmZvIF9ldmVudEluZm87XG4gICAgICAgIHByaXZhdGUgVCBfb2JqO1xuICAgICAgICBwcml2YXRlIERlbGVnYXRlIF9oYW5kbGVyO1xucHVibGljIFRhc2s8VEs+IFRhc2tcclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbXBsZXRlLlRhc2s7XHJcbiAgICB9XHJcbn1cbiAgICAgICAgcHVibGljIFdhaXRGb3JNZShUIG9iaiwgc3RyaW5nIGV2ZW50TkFtZSlcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5TdWJzY3JpYmUob2JqLCBldmVudE5BbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIFdhaXRGb3JNZShUIG9iaiwgRnVuYzxULCBzdHJpbmc+IGV2ZW50bmFtZSlcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5TdWJzY3JpYmUob2JqLCBldmVudG5hbWUuSW52b2tlKG9iaikpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSB2b2lkIFN1YnNjcmliZShUIG9iaiwgc3RyaW5nIGV2ZW50TmFtZSlcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fb2JqID0gb2JqO1xuICAgICAgICAgICAgdGhpcy5fZXZlbnRJbmZvID0gdHlwZW9mKFQpLkdldEV2ZW50KGV2ZW50TmFtZSk7XG4gICAgICAgICAgICBpZiAodGhpcy5fZXZlbnRJbmZvID09IG51bGwpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IE51bGxSZWZlcmVuY2VFeGNlcHRpb24oc3RyaW5nLkZvcm1hdChcIkV2ZW50IHdpdGggbmFtZSB7MH0gbm90IGZvdW5kIG9uIG9iamVjdCBvZiB0eXBlIHsxfVwiLGV2ZW50TmFtZSx0eXBlb2YoVCkpKTtcbiAgICAgICAgICAgIHZhciBtZXRob2RJbmZvID0gdGhpcy5HZXRUeXBlKCkuR2V0TWV0aG9kKFwiT25Db21wbGV0ZVwiLCBCaW5kaW5nRmxhZ3MuTm9uUHVibGljIHwgQmluZGluZ0ZsYWdzLkluc3RhbmNlKTtcblxuICAgICAgICAgICAgaWYgKG1ldGhvZEluZm8gPT0gbnVsbClcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQXJndW1lbnROdWxsRXhjZXB0aW9uKFwibWV0aG9kaW5mb1wiKTtcblxuICAgICAgICAgICAgdGhpcy5faGFuZGxlciA9IERlbGVnYXRlLkNyZWF0ZURlbGVnYXRlKHR5cGVvZihUSyksIHRoaXMsIG1ldGhvZEluZm8pO1xuICAgICAgICAgICAgdGhpcy5fZXZlbnRJbmZvLkFkZEV2ZW50SGFuZGxlcihvYmosIHRoaXMuX2hhbmRsZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSB2b2lkIE9uQ29tcGxldGUob2JqZWN0IHNlbmRlciwgVEsgaGFuZGxlcilcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fZXZlbnRJbmZvLlJlbW92ZUV2ZW50SGFuZGxlcih0aGlzLl9vYmosIHRoaXMuX2hhbmRsZXIpO1xuICAgICAgICAgICAgdGhpcy5fY29tcGxldGUuVHJ5U2V0UmVzdWx0KGhhbmRsZXIpO1xuICAgICAgICB9XG4gICAgfVxufSIsInVzaW5nIEJyaWRnZS5TcGFmO1xuXG5uYW1lc3BhY2UgQXp1cmVEYXkuUm9tZS5SZW1vdGUuVmlld01vZGVsc1xue1xuICAgIHB1YmxpYyBjbGFzcyBHYW1lUmVzdWx0Vmlld01vZGVsIDogTG9hZGFibGVWaWV3TW9kZWxcbiAgICB7XG5wdWJsaWMgb3ZlcnJpZGUgc3RyaW5nIEVsZW1lbnRJZCgpXHJcbntcclxuICAgIHJldHVybiBTcGFmQXBwLkdhbWVSZXN1bHRJZDtcclxufVxuICAgIH1cbn0iLCJ1c2luZyBTeXN0ZW07XG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcbnVzaW5nIEF6dXJlRGF5LlJvbWUuUmVtb3RlLkNsYXNzZXM7XG51c2luZyBBenVyZURheS5Sb21lLlJlbW90ZS5IdWJzO1xudXNpbmcgQXp1cmVEYXkuUm9tZS5SZW1vdGUuTW9kZWxzO1xudXNpbmcgQnJpZGdlLkh0bWw1O1xudXNpbmcgQnJpZGdlLlNwYWY7XG51c2luZyBSZXR5cGVkO1xuXG5uYW1lc3BhY2UgQXp1cmVEYXkuUm9tZS5SZW1vdGUuVmlld01vZGVsc1xue1xuICAgIHB1YmxpYyBjbGFzcyBHYW1lVmlld01vZGVsIDogTG9hZGFibGVWaWV3TW9kZWxcbiAgICB7XG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgSUdhbWVIdWIgX2dhbWVIdWI7XG4gICAgICAgIHByaXZhdGUgR3VpZCBfdGVhbUlkO1xucHVibGljIG92ZXJyaWRlIHN0cmluZyBFbGVtZW50SWQoKVxyXG57XHJcbiAgICByZXR1cm4gU3BhZkFwcC5HYW1lSWQ7XHJcbn0gICAgICAgIFxuICAgICAgICBwdWJsaWMga25vY2tvdXQuS25vY2tvdXRPYnNlcnZhYmxlPEdhbWVTdGF0ZT4gR2FtZSB7IGdldDsgc2V0OyB9XG5cblxuICAgICAgICBwdWJsaWMgR2FtZVZpZXdNb2RlbChJR2FtZUh1YiBnYW1lSHViKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9nYW1lSHViID0gZ2FtZUh1YjtcbiAgICAgICAgICAgIHRoaXMuR2FtZSA9IGtub2Nrb3V0LmtvLm9ic2VydmFibGUuU2VsZjxHYW1lU3RhdGU+KCk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHZvaWQgR2FtZUh1Yk9uT25HYW1lU3RhdGVSZWNlaXZlZChvYmplY3Qgc2VuZGVyLCBHYW1lU3RhdGUgZSlcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5HYW1lLlNlbGYoZSk7XG4gICAgICAgICAgICBpZiAoZSA9PSBHYW1lU3RhdGUuSW5SdW4pXG4gICAgICAgICAgICAgICAgdGhpcy5Td2l0Y2hUb1J1bk1vZGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgdm9pZCBTd2l0Y2hUb1J1bk1vZGUoKVxuICAgICAgICB7XG4gICAgICAgICAgICBHbG9iYWwuQWxlcnQoXCJzdGFydCB0aGUgZ2FtZSFcIik7XG4gICAgICAgIH1cblxuXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSBhc3luYyB2b2lkIE9uTG9hZChEaWN0aW9uYXJ5PHN0cmluZywgb2JqZWN0PiBwYXJhbWV0ZXJzKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9nYW1lSHViLk9uR2FtZVN0YXRlUmVjZWl2ZWQgKz0gdGhpcy5HYW1lSHViT25PbkdhbWVTdGF0ZVJlY2VpdmVkO1xuICAgICAgICAgICAgdGhpcy5fZ2FtZUh1Yi5PbllvdXJUZWFtV2lucyArPSB0aGlzLkdhbWVIdWJPbk9uTm90aWZ5V2lubmVyO1xuICAgICAgICAgICAgdGhpcy5fZ2FtZUh1Yi5PbllvdXJUZWFtTG9zdCArPSBHYW1lSHViT25PbllvdXJUZWFtTG9zdDtcblxuICAgICAgICAgICAgdGhpcy5fdGVhbUlkID0gU3BhZkFwcC5UZWFtSWQ7XG5cbiAgICAgICAgICAgIGF3YWl0IHRoaXMuX2dhbWVIdWIuR2V0R2FtZU1vZGUoKTtcbiAgICAgICAgICAgIGJhc2UuT25Mb2FkKHBhcmFtZXRlcnMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSB2b2lkIEdhbWVIdWJPbk9uWW91clRlYW1Mb3N0KG9iamVjdCBzZW5kZXIsIEV2ZW50QXJncyBlKVxuICAgICAgICB7XG4gICAgICAgICAgICBHbG9iYWwuQWxlcnQoXCJIYWkgcGVyc28hXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSB2b2lkIEdhbWVIdWJPbk9uTm90aWZ5V2lubmVyKG9iamVjdCBzZW5kZXIsIEV2ZW50QXJncyBlKVxuICAgICAgICB7XG4gICAgICAgICAgICBHbG9iYWwuQWxlcnQoXCJIYWkgdmludG8hXCIpO1xuICAgICAgICB9XG5cblxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgdm9pZCBPbkxlYXZlKClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fZ2FtZUh1Yi5PbkdhbWVTdGF0ZVJlY2VpdmVkIC09IHRoaXMuR2FtZUh1Yk9uT25HYW1lU3RhdGVSZWNlaXZlZDtcbiAgICAgICAgICAgIHRoaXMuX2dhbWVIdWIuT25Zb3VyVGVhbVdpbnMgLT0gdGhpcy5HYW1lSHViT25Pbk5vdGlmeVdpbm5lcjtcbiAgICAgICAgICAgIHRoaXMuX2dhbWVIdWIuT25Zb3VyVGVhbUxvc3QgLT0gR2FtZUh1Yk9uT25Zb3VyVGVhbUxvc3Q7XG5cblxuICAgICAgICAgICAgYmFzZS5PbkxlYXZlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgdm9pZCBUYXAoKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9nYW1lSHViLlRhcCgpO1xuICAgICAgICB9XG4gICAgfVxufSIsInVzaW5nIFN5c3RlbTtcbnVzaW5nIEF6dXJlRGF5LlJvbWUuUmVtb3RlLkNsYXNzZXM7XG51c2luZyBBenVyZURheS5Sb21lLlJlbW90ZS5IdWJzO1xudXNpbmcgQnJpZGdlLkh0bWw1O1xudXNpbmcgQnJpZGdlLk5hdmlnYXRpb247XG51c2luZyBCcmlkZ2UuU3BhZjtcbnVzaW5nIFJldHlwZWQ7XG5cbm5hbWVzcGFjZSBBenVyZURheS5Sb21lLlJlbW90ZS5WaWV3TW9kZWxzXG57XG4gICAgcHVibGljIGNsYXNzIFJlZ2lzdGVyVmlld01vZGVsIDogTG9hZGFibGVWaWV3TW9kZWxcbiAgICB7XG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgSUdhbWVIdWIgX2dhbWVIdWI7XG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgSU5hdmlnYXRvciBfbmF2aWdhdG9yO1xucHVibGljIG92ZXJyaWRlIHN0cmluZyBFbGVtZW50SWQoKVxyXG57XHJcbiAgICByZXR1cm4gU3BhZkFwcC5SZWdpc2VySWQ7XHJcbn0gICAgICAgIFxuICAgICAgICBwdWJsaWMga25vY2tvdXQuS25vY2tvdXRPYnNlcnZhYmxlPHN0cmluZz4gTmFtZSB7IGdldDsgc2V0OyB9XG5cbiAgICAgICAgcHVibGljIFJlZ2lzdGVyVmlld01vZGVsKElHYW1lSHViIGdhbWVIdWIsIElOYXZpZ2F0b3IgbmF2aWdhdG9yKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9nYW1lSHViID0gZ2FtZUh1YjtcbiAgICAgICAgICAgIHRoaXMuX25hdmlnYXRvciA9IG5hdmlnYXRvcjtcbiAgICAgICAgICAgIHRoaXMuTmFtZSA9IGtub2Nrb3V0LmtvLm9ic2VydmFibGUuU2VsZjxzdHJpbmc+KCk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgYXN5bmMgdm9pZCBSZWdpc3RlcigpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmIChzdHJpbmcuSXNOdWxsT3JFbXB0eSh0aGlzLk5hbWUuU2VsZigpKSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBHbG9iYWwuQWxlcnQoXCJJbnNlcmlzY2kgdW4gbm9tZVwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuX2dhbWVIdWIuUmVnaXN0ZXIodGhpcy5OYW1lLlNlbGYoKSxTcGFmQXBwLlRlYW1JZCk7XG4gICAgICAgICAgICB0aGlzLl9uYXZpZ2F0b3IuTmF2aWdhdGUoU3BhZkFwcC5HYW1lSWQpO1xuICAgICAgICB9XG5cbiAgICB9XG59IiwidXNpbmcgU3lzdGVtO1xudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XG51c2luZyBBenVyZURheS5Sb21lLlJlbW90ZS5DbGFzc2VzO1xudXNpbmcgQXp1cmVEYXkuUm9tZS5SZW1vdGUuSHVicztcbnVzaW5nIEF6dXJlRGF5LlJvbWUuUmVtb3RlLk1vZGVscztcbnVzaW5nIEJyaWRnZS5IdG1sNTtcbnVzaW5nIEJyaWRnZS5OYXZpZ2F0aW9uO1xudXNpbmcgQnJpZGdlLlNwYWY7XG5cbm5hbWVzcGFjZSBBenVyZURheS5Sb21lLlJlbW90ZS5WaWV3TW9kZWxzXG57XG4gICAgcHVibGljIGNsYXNzIFdhaXRpbmdWaWV3TW9kZWwgOiBMb2FkYWJsZVZpZXdNb2RlbFxuICAgIHtcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBJR2FtZUh1YiBfZ2FtZUh1YjtcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBJTmF2aWdhdG9yIF9uYXZpZ2F0b3I7XG5wdWJsaWMgb3ZlcnJpZGUgc3RyaW5nIEVsZW1lbnRJZCgpXHJcbntcclxuICAgIHJldHVybiBTcGFmQXBwLldhaXRpbmdJZDtcclxufVxuICAgICAgICBwdWJsaWMgV2FpdGluZ1ZpZXdNb2RlbChJR2FtZUh1YiBnYW1lSHViLCBJTmF2aWdhdG9yIG5hdmlnYXRvcilcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fZ2FtZUh1YiA9IGdhbWVIdWI7XG4gICAgICAgICAgICB0aGlzLl9uYXZpZ2F0b3IgPSBuYXZpZ2F0b3I7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHZvaWQgR2FtZUh1Yk9uT25HYW1lU3RhdGVSZWNlaXZlZChvYmplY3Qgc2VuZGVyLCBHYW1lU3RhdGUgZSlcbiAgICAgICAge1xuICAgICAgICAgICAgaWYoZSA9PSBHYW1lU3RhdGUuUmVnaXN0ZXIpXG4gICAgICAgICAgICAgICAgdGhpcy5fbmF2aWdhdG9yLk5hdmlnYXRlKFNwYWZBcHAuUmVnaXNlcklkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSB2b2lkIE9uTGVhdmUoKVxuICAgICAgICB7XG4gICAgICAgICAgICBiYXNlLk9uTGVhdmUoKTtcbiAgICAgICAgICAgIHRoaXMuX2dhbWVIdWIuT25HYW1lU3RhdGVSZWNlaXZlZCAtPSB0aGlzLkdhbWVIdWJPbk9uR2FtZVN0YXRlUmVjZWl2ZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgYXN5bmMgdm9pZCBPbkxvYWQoRGljdGlvbmFyeTxzdHJpbmcsIG9iamVjdD4gcGFyYW1ldGVycylcbiAgICAgICAge1xuICAgICAgICAgICAgYmFzZS5PbkxvYWQocGFyYW1ldGVycyk7XG5cbiAgICAgICAgICAgIHRyeVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFNwYWZBcHAuVGVhbUlkID0gcGFyYW1ldGVycy5HZXRQYXJhbWV0ZXI8R3VpZD4oXCJ0ZWFtSWRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoRXhjZXB0aW9uIGUpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgR2xvYmFsLkFsZXJ0KFwiRXJyb3JlLCBub24gdHJvdm8gaWwgdGVhbSBpZCFcIik7XG4gICAgICAgICAgICAgICAgdGhyb3c7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgXG5cbiAgICAgICAgICAgIHZhciBtb2RlID0gYXdhaXQgdGhpcy5fZ2FtZUh1Yi5HZXRHYW1lTW9kZSgpO1xuXG4gICAgICAgICAgICBzd2l0Y2ggKG1vZGUpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY2FzZSBHYW1lU3RhdGUuQ2xvc2VkOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9nYW1lSHViLk9uR2FtZVN0YXRlUmVjZWl2ZWQgKz0gdGhpcy5HYW1lSHViT25PbkdhbWVTdGF0ZVJlY2VpdmVkO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIEdhbWVTdGF0ZS5SZWdpc3RlcjpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbmF2aWdhdG9yLk5hdmlnYXRlKFNwYWZBcHAuUmVnaXNlcklkKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBHYW1lU3RhdGUuSW5SdW46XG4gICAgICAgICAgICAgICAgICAgIEdsb2JhbC5BbGVydChcIkRvdmV2aSBlc3NlcmUgcGl1IHZlbG9jZS4uIGlsIGdpb2NvIMOoIGdpw6AgaW4gY29yc28uXCIpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIEdhbWVTdGF0ZS5GaW5pc2hlZDpcbiAgICAgICAgICAgICAgICAgICAgR2xvYmFsLkFsZXJ0KFwiSWwgZ2lvY28gw6ggY29uY2x1c28uLiByZXN0YSBpbiBhdHRlc2EgbmVsIGNhc28gaW5pemlhc3NlIHVuYSBudW92YSBjb3JzYS5cIik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBBcmd1bWVudE91dE9mUmFuZ2VFeGNlcHRpb24oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0iLCJ1c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcbnVzaW5nIEF6dXJlRGF5LlJvbWUuUmVtb3RlLlZpZXdNb2RlbHM7XG51c2luZyBCcmlkZ2UualF1ZXJ5MjtcbnVzaW5nIEJyaWRnZS5OYXZpZ2F0aW9uO1xuXG5uYW1lc3BhY2UgQnJpZGdlLlNwYWZcbntcbiAgICBjbGFzcyBDdXN0b21Sb3V0ZXNDb25maWcgOiBCcmlkZ2VOYXZpZ2F0b3JDb25maWdCYXNlXG4gICAge1xuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgSUxpc3Q8SVBhZ2VEZXNjcmlwdG9yPiBDcmVhdGVSb3V0ZXMoKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gZ2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkNhbGxGb3IobmV3IExpc3Q8SVBhZ2VEZXNjcmlwdG9yPigpLChfbzEpPT57X28xLkFkZChuZXcgUGFnZURlc2NyaXB0b3JcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIENhbkJlRGlyZWN0TG9hZCA9ICgpPT50cnVlLFxuICAgICAgICAgICAgICAgICAgICBIdG1sTG9jYXRpb24gPSAoKT0+XCJwYWdlcy93YWl0aW5nLmh0bWxcIixcbiAgICAgICAgICAgICAgICAgICAgS2V5ID0gU3BhZkFwcC5XYWl0aW5nSWQsXG4gICAgICAgICAgICAgICAgICAgIFBhZ2VDb250cm9sbGVyID0gKCkgPT4gU3BhZkFwcC5Db250YWluZXIuUmVzb2x2ZTxXYWl0aW5nVmlld01vZGVsPigpXG4gICAgICAgICAgICAgICAgfSk7X28xLkFkZChuZXcgUGFnZURlc2NyaXB0b3JcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIENhbkJlRGlyZWN0TG9hZCA9ICgpPT5mYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgSHRtbExvY2F0aW9uID0gKCk9PlwicGFnZXMvcmVnaXN0ZXIuaHRtbFwiLFxuICAgICAgICAgICAgICAgICAgICBLZXkgPSBTcGFmQXBwLlJlZ2lzZXJJZCxcbiAgICAgICAgICAgICAgICAgICAgUGFnZUNvbnRyb2xsZXIgPSAoKSA9PiBTcGFmQXBwLkNvbnRhaW5lci5SZXNvbHZlPFJlZ2lzdGVyVmlld01vZGVsPigpXG4gICAgICAgICAgICAgICAgfSk7X28xLkFkZChuZXcgUGFnZURlc2NyaXB0b3JcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIENhbkJlRGlyZWN0TG9hZCA9ICgpPT5mYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgSHRtbExvY2F0aW9uID0gKCk9PlwicGFnZXMvZ2FtZS5odG1sXCIsXG4gICAgICAgICAgICAgICAgICAgIEtleSA9IFNwYWZBcHAuR2FtZUlkLFxuICAgICAgICAgICAgICAgICAgICBQYWdlQ29udHJvbGxlciA9ICgpID0+IFNwYWZBcHAuQ29udGFpbmVyLlJlc29sdmU8R2FtZVZpZXdNb2RlbD4oKVxuICAgICAgICAgICAgICAgIH0pO19vMS5BZGQobmV3IFBhZ2VEZXNjcmlwdG9yXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBDYW5CZURpcmVjdExvYWQgPSAoKT0+ZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIEh0bWxMb2NhdGlvbiA9ICgpPT5cInBhZ2VzL2dhbWVSZXN1bHQuaHRtbFwiLFxuICAgICAgICAgICAgICAgICAgICBLZXkgPSBTcGFmQXBwLkdhbWVSZXN1bHRJZCxcbiAgICAgICAgICAgICAgICAgICAgUGFnZUNvbnRyb2xsZXIgPSAoKSA9PiBTcGFmQXBwLkNvbnRhaW5lci5SZXNvbHZlPEdhbWVSZXN1bHRWaWV3TW9kZWw+KClcbiAgICAgICAgICAgICAgICB9KTtyZXR1cm4gX28xO30pO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIG92ZXJyaWRlIGpRdWVyeSBCb2R5IHsgZ2V0OyBwcml2YXRlIHNldDsgfVxuXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSBzdHJpbmcgSG9tZUlkIHsgZ2V0OyBwcml2YXRlIHNldDsgfVxuXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSBib29sIERpc2FibGVBdXRvU3BhZkFuY2hvcnNPbk5hdmlnYXRlIHsgZ2V0OyBwcml2YXRlIHNldDsgfVxuXG5cbiAgICBcbnByaXZhdGUgalF1ZXJ5IF9fUHJvcGVydHlfX0luaXRpYWxpemVyX19Cb2R5PWpRdWVyeS5TZWxlY3QoXCIjcGFnZUJvZHlcIik7cHJpdmF0ZSBzdHJpbmcgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX0hvbWVJZD1TcGFmQXBwLldhaXRpbmdJZDtwcml2YXRlIGJvb2wgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX0Rpc2FibGVBdXRvU3BhZkFuY2hvcnNPbk5hdmlnYXRlPXRydWU7fVxufVxuIiwidXNpbmcgU3lzdGVtO1xudXNpbmcgU3lzdGVtLkxpbnE7XG51c2luZyBTeXN0ZW0uUmVmbGVjdGlvbjtcbnVzaW5nIEF6dXJlRGF5LlJvbWUuUmVtb3RlLkh1YnM7XG51c2luZyBBenVyZURheS5Sb21lLlJlbW90ZS5IdWJzLkltcGw7XG51c2luZyBCcmlkZ2U7XG51c2luZyBCcmlkZ2UuSHRtbDU7XG51c2luZyBCcmlkZ2UuSW9jO1xudXNpbmcgQnJpZGdlLk1lc3NlbmdlcjtcbnVzaW5nIEJyaWRnZS5OYXZpZ2F0aW9uO1xudXNpbmcgQnJpZGdlLlNwYWYuQXR0cmlidXRlcztcblxubmFtZXNwYWNlIEJyaWRnZS5TcGFmXG57XG4gICAgcHVibGljIGNsYXNzIFNwYWZBcHBcbiAgICB7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgR3VpZCBUZWFtSWQgeyBnZXQ7IHNldDsgfVxuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSUlvYyBDb250YWluZXI7XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIE1haW4oKVxuICAgICAgICB7XG4gICAgICAgICAgICBDb250YWluZXIgPSBuZXcgQnJpZGdlSW9jKCk7XG4gICAgICAgICAgICBDb250YWluZXJDb25maWcoKTsgLy8gY29uZmlnIGNvbnRhaW5lclxuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgaHViID0gQ29udGFpbmVyLlJlc29sdmU8SUdhbWVIdWI+KCk7XG4gICAgICAgICAgICBodWIuU3RhcnQoKGdsb2JhbDo6U3lzdGVtLkFjdGlvbikoKCkgPT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBDb250YWluZXIuUmVzb2x2ZTxJTmF2aWdhdG9yPigpLkluaXROYXZpZ2F0aW9uKCk7IC8vIGluaXQgbmF2aWdhdGlvblxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICBodWIuT25OZXdQbGF5ZXJJbllvdXJUZWFtSm9pbmVkICs9IChzZW5kZXIsIHBsYXllcikgPT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBHbG9iYWwuQWxlcnQoc3RyaW5nLkZvcm1hdChcIkxhIHR1YSBzcXVhZHJhIGhhIHVuIG51b3ZvIHBsYXllcjogezB9XCIscGxheWVyLk5hbWUpKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgc3RhdGljIHZvaWQgQ29udGFpbmVyQ29uZmlnKClcbiAgICAgICAge1xuICAgICAgICAgICAgLy8gbmF2aWdhdG9yXG4gICAgICAgICAgICBDb250YWluZXIuUmVnaXN0ZXJTaW5nbGVJbnN0YW5jZTxJTmF2aWdhdG9yLCBCcmlkZ2VOYXZpZ2F0b3JXaXRoUm91dGluZz4oKTtcbiAgICAgICAgICAgIENvbnRhaW5lci5SZWdpc3RlclNpbmdsZUluc3RhbmNlPElCcm93c2VySGlzdG9yeU1hbmFnZXIsIFF1ZXJ5UGFyYW1ldGVyTmF2aWdhdGlvbkhpc3Rvcnk+KCk7XG4vLyAgICAgICAgICAgIENvbnRhaW5lci5SZWdpc3RlclNpbmdsZUluc3RhbmNlPElCcm93c2VySGlzdG9yeU1hbmFnZXIsIENvbXBsZXhPYmplY3ROYXZpZ2F0aW9uSGlzdG9yeT4oKTsgLy8gaWYgeW91IGRvbid0IG5lZWQgcXVlcnkgcGFyYW1ldGVyc1xuICAgICAgICAgICAgQ29udGFpbmVyLlJlZ2lzdGVyPElOYXZpZ2F0b3JDb25maWd1cmF0b3IsIEN1c3RvbVJvdXRlc0NvbmZpZz4oKTsgXG5cbiAgICAgICAgICAgIC8vIG1lc3NlbmdlclxuICAgICAgICAgICAgQ29udGFpbmVyLlJlZ2lzdGVyU2luZ2xlSW5zdGFuY2U8SU1lc3NlbmdlciwgTWVzc2VuZ2VyLk1lc3Nlbmdlcj4oKTtcblxuICAgICAgICAgICAgLy8gdmlld21vZGVsc1xuICAgICAgICAgICAgUmVnaXN0ZXJBbGxWaWV3TW9kZWxzKCk7XG5cbiAgICAgICAgICAgIC8vIHJlZ2lzdGVyIGN1c3RvbSByZXNvdXJjZSwgc2VydmljZXMuLlxuICAgICAgICAgICAgQ29udGFpbmVyLlJlZ2lzdGVyU2luZ2xlSW5zdGFuY2U8SUdhbWVIdWIsIEdhbWVIdWI+KCk7XG5cblxuICAgICAgICB9XG4jcmVnaW9uIFBBR0VTIElEU1xyXG4vLyBzdGF0aWMgcGFnZXMgaWRcclxucHVibGljIHN0YXRpYyBzdHJpbmcgV2FpdGluZ0lkXHJcbntcclxuICAgIGdldFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBcIndhaXRpbmdcIjtcclxuICAgIH1cclxufXB1YmxpYyBzdGF0aWMgc3RyaW5nIEdhbWVJZFxyXG57XHJcbiAgICBnZXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gXCJnYW1lXCI7XHJcbiAgICB9XHJcbn1wdWJsaWMgc3RhdGljIHN0cmluZyBHYW1lUmVzdWx0SWRcclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIFwiZ2FtZVJlc3VsdFwiO1xyXG4gICAgfVxyXG59cHVibGljIHN0YXRpYyBzdHJpbmcgUmVnaXNlcklkXHJcbntcclxuICAgIGdldFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBcInJlZ2lzdGVyXCI7XHJcbiAgICB9XHJcbn1cbiAgICAgICAgI2VuZHJlZ2lvblxuXG4gICAgICAgICNyZWdpb24gTUVTU0FHRVNcbiAgICAgICAgLy8gbWVzc2VuZ2VyIGhlbHBlciBmb3IgZ2xvYmFsIG1lc3NhZ2VzIGFuZCBtZXNzYWdlcyBpZHNcblxuICAgICAgICBwdWJsaWMgc3RhdGljIGNsYXNzIE1lc3NhZ2VzXG4gICAgICAgIHtcbiAgICAgICAgICAgIHB1YmxpYyBjbGFzcyBHbG9iYWxTZW5kZXIgeyB9O1xuXG4gICAgICAgICAgICBwdWJsaWMgc3RhdGljIEdsb2JhbFNlbmRlciBTZW5kZXIgPSBuZXcgR2xvYmFsU2VuZGVyKCk7XG5cbiAgICAgICAgICAgIC8vcHVibGljIHN0YXRpYyBzdHJpbmcgTG9naW5Eb25lID0+IFwiTG9naW5Eb25lXCI7XG5cbiAgICAgICAgfVxuXG5cbiAgICAgICAgI2VuZHJlZ2lvblxuXG4gICAgICAgIC8vLyA8c3VtbWFyeT5cbiAgICAgICAgLy8vIFJlZ2lzdGVyIGFsbCB0eXBlcyB0aGF0IGVuZCB3aXRoIFwidmlld21vZGVsXCIuXG4gICAgICAgIC8vLyBZb3UgY2FuIHJlZ2lzdGVyIGEgdmlld21vZGUgYXMgU2luZ2xyIEluc3RhbmNlIGFkZGluZyBcIlNpbmdsZUluc3RhbmNlQXR0cmlidXRlXCIgdG8gdGhlIGNsYXNzXG4gICAgICAgIC8vLyA8L3N1bW1hcnk+XG4gICAgICAgIHByaXZhdGUgc3RhdGljIHZvaWQgUmVnaXN0ZXJBbGxWaWV3TW9kZWxzKClcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIHR5cGVzID0gU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5TZWxlY3RNYW55PGdsb2JhbDo6U3lzdGVtLlJlZmxlY3Rpb24uQXNzZW1ibHksZ2xvYmFsOjpTeXN0ZW0uVHlwZT4oQXBwRG9tYWluLkN1cnJlbnREb21haW4uR2V0QXNzZW1ibGllcygpLChnbG9iYWw6OlN5c3RlbS5GdW5jPGdsb2JhbDo6U3lzdGVtLlJlZmxlY3Rpb24uQXNzZW1ibHksIGdsb2JhbDo6U3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWMuSUVudW1lcmFibGU8Z2xvYmFsOjpTeXN0ZW0uVHlwZT4+KShzID0+IHMuR2V0VHlwZXMoKSkpXG4gICAgICAgICAgICAgICAgLldoZXJlKChnbG9iYWw6OlN5c3RlbS5GdW5jPGdsb2JhbDo6U3lzdGVtLlR5cGUsIGJvb2w+KSh3ID0+IHcuTmFtZS5Ub0xvd2VyKCkuRW5kc1dpdGgoXCJ2aWV3bW9kZWxcIikpKS5Ub0xpc3QoKTtcblxuICAgICAgICAgICAgdHlwZXMuRm9yRWFjaCgoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uPGdsb2JhbDo6U3lzdGVtLlR5cGU+KShmID0+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdmFyIGF0dHJpYnV0ZXMgPSBmLkdldEN1c3RvbUF0dHJpYnV0ZXModHlwZW9mKFNpbmdsZUluc3RhbmNlQXR0cmlidXRlKSwgdHJ1ZSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5Bbnk8b2JqZWN0PihhdHRyaWJ1dGVzKSlcbiAgICAgICAgICAgICAgICAgICAgQ29udGFpbmVyLlJlZ2lzdGVyU2luZ2xlSW5zdGFuY2UoZik7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBDb250YWluZXIuUmVnaXN0ZXIoZik7XG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgfVxuICAgIH1cbn1cbiIsInVzaW5nIFN5c3RlbTtcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XG51c2luZyBBenVyZURheS5Sb21lLlJlbW90ZS5DbGFzc2VzO1xudXNpbmcgQXp1cmVEYXkuUm9tZS5SZW1vdGUuTW9kZWxzO1xudXNpbmcgQnJpZGdlLkFzcE5ldENvcmUuU2lnbmFsUi5DbGllbnQ7XG51c2luZyBCcmlkZ2UuSHRtbDU7XG5cbm5hbWVzcGFjZSBBenVyZURheS5Sb21lLlJlbW90ZS5IdWJzLkltcGxcbntcbiAgICBwdWJsaWMgY2xhc3MgR2FtZUh1YiA6IElHYW1lSHViXG4gICAge1xuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IEh1YkNvbm5lY3Rpb24gX2Nvbm5lY3Rpb247XG5cbiAgICAgICAgcHVibGljIGV2ZW50IEV2ZW50SGFuZGxlcjxQbGF5ZXI+IE9uTmV3UGxheWVySW5Zb3VyVGVhbUpvaW5lZDtcbiAgICAgICAgcHVibGljIGV2ZW50IEV2ZW50SGFuZGxlciBPblJlZ2lzdGVyRG9uZTtcbiAgICAgICAgXG4gICAgICAgIHB1YmxpYyBldmVudCBFdmVudEhhbmRsZXI8R2FtZVN0YXRlPiBPbkdhbWVTdGF0ZVJlY2VpdmVkO1xuICAgICAgICBwdWJsaWMgZXZlbnQgRXZlbnRIYW5kbGVyIE9uWW91clRlYW1XaW5zO1xuICAgICAgICBwdWJsaWMgZXZlbnQgRXZlbnRIYW5kbGVyIE9uWW91clRlYW1Mb3N0O1xuXG4gICAgICAgIHB1YmxpYyBHYW1lSHViKClcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbiA9ICBuZXcgSHViQ29ubmVjdGlvbkJ1aWxkZXIoKS5XaXRoVXJsKENvbmZpZ3VyYXRpb24uR2FtZVNlcnZlcikuQnVpbGQoKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5PbihcInJlZ2lzdGVyRG9uZVwiLG5ldyBBY3Rpb24oKCkgPT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLk9uUmVnaXN0ZXJEb25lIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tTGFtYmRhKCgpPT50aGlzLk9uUmVnaXN0ZXJEb25lLkludm9rZSh0aGlzLG51bGwpKTpudWxsO1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLk9uKFwiZ2FtZVN0YXRlTW9kZVwiLG5ldyBBY3Rpb248R2FtZVN0YXRlPigoZ2FtZVN0YXRlKSA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuT25HYW1lU3RhdGVSZWNlaXZlZCE9bnVsbD9nbG9iYWw6OkJyaWRnZS5TY3JpcHQuRnJvbUxhbWJkYSgoKT0+dGhpcy5PbkdhbWVTdGF0ZVJlY2VpdmVkLkludm9rZSh0aGlzLGdhbWVTdGF0ZSkpOm51bGw7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5PbihcIm5ld1BsYXllckluVGhpc0dyb3VwXCIsbmV3IEFjdGlvbjxQbGF5ZXI+KChwbGF5ZXIpID0+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5Pbk5ld1BsYXllckluWW91clRlYW1Kb2luZWQhPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21MYW1iZGEoKCk9PnRoaXMuT25OZXdQbGF5ZXJJbllvdXJUZWFtSm9pbmVkLkludm9rZSh0aGlzLHBsYXllcikpOm51bGw7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uT24oXCJ5b3VyVGVhbVdpbnNcIixuZXcgQWN0aW9uKCgpID0+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5PbllvdXJUZWFtV2lucyE9bnVsbD9nbG9iYWw6OkJyaWRnZS5TY3JpcHQuRnJvbUxhbWJkYSgoKT0+dGhpcy5PbllvdXJUZWFtV2lucy5JbnZva2UodGhpcyxudWxsKSk6bnVsbDtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5PbihcInlvdXJUZWFtTG9zdFwiLG5ldyBBY3Rpb24oKCkgPT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLk9uWW91clRlYW1Mb3N0IT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tTGFtYmRhKCgpPT50aGlzLk9uWW91clRlYW1Mb3N0Lkludm9rZSh0aGlzLG51bGwpKTpudWxsO1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgXG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgdm9pZCBTdGFydChBY3Rpb24gb25TdGFydGVkKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLlN0YXJ0KCkuVGhlbigoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uKSgoKSA9Pm9uU3RhcnRlZCE9bnVsbD9nbG9iYWw6OkJyaWRnZS5TY3JpcHQuRnJvbUxhbWJkYSgoKT0+b25TdGFydGVkLkludm9rZSgpKTpudWxsKSwoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uPG9iamVjdD4pKG8gPT4gR2xvYmFsLkFsZXJ0KG8uVG9TdHJpbmcoKSkpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyB2b2lkIFN0b3AoKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLlN0b3AoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyB2b2lkIFRhcCgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24uU2VuZChcInRhcFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBUYXNrIFJlZ2lzdGVyKHN0cmluZyBuYW1lLCBHdWlkIHRlYW0pXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciB3YWl0Rm9yTWUgPSBuZXcgV2FpdEZvck1lPElHYW1lSHViLCBHYW1lU3RhdGU+KHRoaXMsIGh1YiA9PiBcIk9uUmVnaXN0ZXJEb25lXCIpO1xuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGlvbi5TZW5kKFwicmVnaXN0ZXJcIixuYW1lLHRlYW0pO1xuICAgICAgICAgICAgcmV0dXJuIHdhaXRGb3JNZS5UYXNrO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIFRhc2s8R2FtZVN0YXRlPiBHZXRHYW1lTW9kZSgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciB3YWl0Rm9yTWUgPSBuZXcgV2FpdEZvck1lPElHYW1lSHViLCBHYW1lU3RhdGU+KHRoaXMsIGh1YiA9PiBcIk9uR2FtZVN0YXRlUmVjZWl2ZWRcIik7XG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uLlNlbmQoXCJnZXRTdGF0ZU1vZGVcIik7XG4gICAgICAgICAgICByZXR1cm4gd2FpdEZvck1lLlRhc2s7XG4gICAgICAgIH1cbiAgICB9XG59Il0KfQo=
