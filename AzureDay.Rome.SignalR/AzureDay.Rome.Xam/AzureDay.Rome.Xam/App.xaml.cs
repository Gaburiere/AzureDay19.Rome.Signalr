﻿using System;
using AzureDay.Rome.Xam.Services;
using AzureDay.Rome.Xam.Services.Impl;
using DryIoc;
using Xam.Zero;
using Xam.Zero.DryIoc;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

[assembly: XamlCompilation(XamlCompilationOptions.Compile)]

namespace AzureDay.Rome.Xam
{
    public partial class App : Application
    {
        
        public static readonly Container Container = new Container();
        
        public App()
        {
            this.InitializeComponent();
            
            Container.Register<IMoveItHubService,MoveItHubService>(Reuse.Singleton);

            ZeroApp.On(this)
                .WithContainer(DryIocZeroContainer.Build(Container))
                .RegisterShell(() => new TabbedShell())
                .StartWith<TabbedShell>();
        }

        protected override void OnStart()
        {
            // Handle when your app starts
        }

        protected override void OnSleep()
        {
            // Handle when your app sleeps
        }

        protected override void OnResume()
        {
            // Handle when your app resumes
        }
    }
}